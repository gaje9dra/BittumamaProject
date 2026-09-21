import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAdminSession } from "@/lib/auth/admin-session";
import type { ApiActor } from "@/lib/api/types";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";

export async function getApiActor(): Promise<ApiActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.client.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, role: true } });
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requireApiUser(): Promise<ApiActor> {
  const actor = await getApiActor();
  if (!actor) throw new Error("UNAUTHENTICATED");
  return actor;
}

export async function requireApiAdmin(): Promise<ApiActor> {
  const admin = await getCurrentAdminSession();
  if (!admin) {
    await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHORIZATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Administrative API access attempt was blocked.", actor: { userId: null, type: "SYSTEM" } });
    throw new Error("FORBIDDEN");
  }
  return { id: admin.id, name: null, email: admin.email, role: "ADMIN" };
}
