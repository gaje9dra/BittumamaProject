import "server-only";

import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db/prisma";

export const ADMIN_SESSION_COOKIE = "bittumama_admin_session";
const MAX_AGE = 8 * 60 * 60;
const options = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE };

export type AdminAuthContext = { id: string; email: string; isActive: boolean };

export async function createAdminSession(adminAccountId: string) {
  const sessionToken = randomBytes(32).toString("hex");
  await prisma.client.adminSession.create({ data: { sessionToken, adminAccountId, expires: new Date(Date.now() + MAX_AGE * 1000) } });
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, sessionToken, options);
}

export async function getCurrentAdminSession(): Promise<AdminAuthContext | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.client.adminSession.findUnique({
    where: { sessionToken: token },
    select: { id: true, expires: true, adminAccount: { select: { id: true, email: true, isActive: true } } },
  });
  if (!session || session.expires <= new Date() || !session.adminAccount.isActive) {
    if (session) await prisma.client.adminSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  return session.adminAccount;
}

export async function destroyCurrentAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await prisma.client.adminSession.deleteMany({ where: { sessionToken: token } });
  store.set(ADMIN_SESSION_COOKIE, "", { ...options, maxAge: 0 });
}

export async function revokeAdminSessions(adminAccountId: string) {
  await prisma.client.adminSession.deleteMany({ where: { adminAccountId } });
}
