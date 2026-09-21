import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdminSession, type AdminAuthContext } from "@/lib/auth/admin-session";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";

export async function getCurrentSession() { return auth(); }
export async function getCurrentUser() { const session = await auth(); return session?.user ?? null; }

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=%2Fauth-test");
  return user;
}

export async function requireAdminSession(): Promise<AdminAuthContext> {
  const admin = await getCurrentAdminSession();
  if (!admin) {
    await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHORIZATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Administrator page access attempt was blocked.", actor: { userId: null, type: "SYSTEM" } });
    redirect("/admin/login");
  }
  return admin;
}

export const requireAdmin = requireAdminSession;
