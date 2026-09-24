import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db/prisma";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { recordAuditBestEffort } from "@/lib/audit/service";

const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers = googleConfigured
  ? [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
    ]
  : [];

export const isGoogleAuthConfigured = googleConfigured;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma.client),
  providers,
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
  // Netlify terminates HTTPS and forwards the public host/protocol to the
  // Next.js runtime. Auth.js must trust that provider-controlled host.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHENTICATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Authentication attempt rejected because the account had no usable email.", actor: { userId: null, type: "SYSTEM" } });
        return false;
      }
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim());
      if (valid && user.id) await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, summary: "User authenticated successfully.", actor: { userId: user.id, type: "USER" } });
      else await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHENTICATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Authentication attempt failed validation.", actor: { userId: null, type: "SYSTEM" } });
      return valid;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        const base = new URL(baseUrl);
        if (target.origin !== base.origin) return baseUrl;
        if (target.pathname === "/admin" || target.pathname.startsWith("/admin/")) return new URL("/auth-test", base).href;
        return target.href;
      } catch {
        return baseUrl;
      }
    },
  },
});
