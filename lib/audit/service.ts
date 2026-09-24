import type { PrismaClient } from "@/generated/prisma/client";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { normalizeAuditInput, type AuditRecordInput } from "@/lib/audit/types";

type AuditDb = Pick<PrismaClient, "auditLog">;

export async function recordAudit(db: AuditDb, input: AuditRecordInput) {
  const normalized = normalizeAuditInput(input);
  return db.auditLog.create({
    data: {
      actorUserId: normalized.actor?.userId ?? null,
      action: normalized.action,
      category: normalized.category,
      entityType: normalized.entityType ?? null,
      entityId: normalized.entityId ?? null,
      result: normalized.result,
      severity: normalized.severity ?? AuditSeverity.INFO,
      summary: normalized.summary,
      metadata: normalized.metadata,
      requestId: normalized.requestId ?? null,
      ipAddress: normalized.ipAddress ?? null,
      userAgent: normalized.userAgent ?? null,
    },
  });
}

export async function recordAuditBestEffort(db: AuditDb, input: AuditRecordInput) {
  try {
    return await recordAudit(db, input);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Audit log write failed:", error);
    return null;
  }
}

export const AUDIT = {
  login: (userId: string) => ({ action: AuditAction.AUTH_LOGIN, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, summary: "User authenticated successfully.", actor: { userId, type: "USER" as const } }),
  loginFailed: () => ({ action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHENTICATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Authentication attempt failed.", actor: { userId: null, type: "SYSTEM" as const } }),
  roleChanged: (actorUserId: string, targetUserId: string, previousRole: string, newRole: string) => ({ action: AuditAction.USER_ROLE_CHANGED, category: AuditCategory.AUTHORIZATION, result: AuditResult.SUCCESS, severity: AuditSeverity.WARNING, summary: "User role changed.", entityType: "User", entityId: targetUserId, metadata: { targetUserId, previousRole, newRole }, actor: { userId: actorUserId, type: "USER" as const } }),
};
