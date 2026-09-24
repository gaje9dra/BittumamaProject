import type { Prisma, AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";

export type AuditActor = { userId: string | null; type: "USER" | "SYSTEM" };

export type AuditMetadata = Record<string, string | number | boolean | null>;

export type AuditRecordInput = {
  action: AuditAction;
  category: AuditCategory;
  result: AuditResult;
  severity?: AuditSeverity;
  summary: string;
  entityType?: string;
  entityId?: string;
  metadata?: AuditMetadata;
  requestId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  actor?: AuditActor;
};

export type AuditQuery = {
  page?: number;
  pageSize?: number;
  action?: AuditAction;
  category?: AuditCategory;
  actorUserId?: string;
  result?: AuditResult;
  severity?: AuditSeverity;
  entityType?: string;
  entityId?: string;
  search?: string;
  start?: Date;
  end?: Date;
};

export type AuditLogRecord = {
  id: string;
  actorUserId: string | null;
  action: AuditAction;
  category: AuditCategory;
  entityType: string | null;
  entityId: string | null;
  result: AuditResult;
  severity: AuditSeverity;
  summary: string;
  metadata: Prisma.JsonValue | null;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};

const SECRET_KEY = /(password|token|secret|apikey|authorization|cookie|session|signature|cardnumber|cvv|accesstoken|refreshtoken)/i;

export function sanitizeAuditMetadata(metadata?: AuditMetadata): AuditMetadata | undefined {
  if (!metadata) return undefined;
  const sanitized: AuditMetadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!SECRET_KEY.test(key)) sanitized[key.slice(0, 80)] = typeof value === "string" ? value.slice(0, 500) : value;
  }
  return sanitized;
}

export function normalizeAuditInput(input: AuditRecordInput): AuditRecordInput {
  const summary = input.summary.trim().slice(0, 500);
  if (!summary) throw new Error("AUDIT_SUMMARY_REQUIRED");
  return {
    ...input,
    summary,
    entityType: input.entityType?.trim().slice(0, 80),
    entityId: input.entityId?.trim().slice(0, 128),
    requestId: input.requestId?.trim().slice(0, 128),
    ipAddress: input.ipAddress?.trim().slice(0, 64),
    userAgent: input.userAgent?.trim().slice(0, 500),
    metadata: sanitizeAuditMetadata(input.metadata),
  };
}
