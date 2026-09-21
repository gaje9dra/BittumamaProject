import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import type { ApiActor } from "@/lib/api/types";
import { ADMIN_CONTEXT_COOKIE, isValidAdminContext } from "@/lib/auth/admin-context";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";

export async function getApiActor(): Promise<ApiActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.client.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireApiUser(): Promise<ApiActor> {
  const actor = await getApiActor();
  if (!actor) throw new Error("UNAUTHENTICATED");
  return actor;
}

export async function requireApiAdmin(): Promise<ApiActor> {
  const actor = await requireApiUser();

  if (actor.role !== "ADMIN") {
    await recordAuditBestEffort(prisma.client, {
      action: AuditAction.AUTH_LOGIN_FAILED,
      category: AuditCategory.AUTHORIZATION,
      result: AuditResult.FAILURE,
      severity: AuditSeverity.WARNING,
      summary: "Administrative API access was blocked by the authoritative database role.",
      actor: { userId: actor.id, type: "USER" },
    });
    throw new Error("FORBIDDEN");
  }

  const store = await cookies();
  const context = store.get(ADMIN_CONTEXT_COOKIE)?.value;
  if (!isValidAdminContext(context)) {
    await recordAuditBestEffort(prisma.client, {
      action: AuditAction.AUTH_LOGIN_FAILED,
      category: AuditCategory.AUTHORIZATION,
      result: AuditResult.FAILURE,
      severity: AuditSeverity.WARNING,
      summary: "Administrative API access was blocked because the admin authentication context was missing or invalid.",
      actor: { userId: actor.id, type: "USER" },
    });
    throw new Error("FORBIDDEN");
  }

  return actor;
}
