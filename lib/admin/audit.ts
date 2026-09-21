import "server-only";

import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import type { AuditQuery } from "@/lib/audit/types";

const PAGE_SIZE_MAX = 50;
const PAGE_MAX = 100;

export function parseAuditQuery(input: Record<string, string | undefined>): AuditQuery & { page: number; pageSize: number } {
  const page = Math.min(PAGE_MAX, Math.max(1, Number.parseInt(input.page ?? "1", 10) || 1));
  const pageSize = Math.min(PAGE_SIZE_MAX, Math.max(10, Number.parseInt(input.pageSize ?? "25", 10) || 25));
  const enumValue = <T extends string>(values: readonly T[], value?: string) => values.includes(value as T) ? value as T : undefined;
  const parseDate = (value?: string) => { if (!value) return undefined; const date = new Date(value); return Number.isNaN(date.getTime()) ? undefined : date; };
  return { page, pageSize, action: enumValue(Object.values(AuditAction), input.action), category: enumValue(Object.values(AuditCategory), input.category), result: enumValue(Object.values(AuditResult), input.result), severity: enumValue(Object.values(AuditSeverity), input.severity), actorUserId: input.actor?.trim().slice(0, 128) || undefined, entityType: input.entityType?.trim().slice(0, 80) || undefined, entityId: input.entityId?.trim().slice(0, 128) || undefined, search: input.search?.trim().slice(0, 160) || undefined, start: parseDate(input.start), end: parseDate(input.end) };
}

export async function getAuditLogs(query: AuditQuery & { page: number; pageSize: number }) {
  await requireAdmin();
  const where = {
    ...(query.action ? { action: query.action } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.actorUserId ? { actorUserId: query.actorUserId } : {}),
    ...(query.result ? { result: query.result } : {}),
    ...(query.severity ? { severity: query.severity } : {}),
    ...(query.entityType ? { entityType: query.entityType } : {}),
    ...(query.entityId ? { entityId: query.entityId } : {}),
    ...(query.search ? { OR: [{ summary: { contains: query.search, mode: "insensitive" as const } }, { entityId: { contains: query.search, mode: "insensitive" as const } }, { requestId: { contains: query.search, mode: "insensitive" as const } }] } : {}),
    ...(query.start || query.end ? { createdAt: { ...(query.start ? { gte: query.start } : {}), ...(query.end ? { lte: query.end } : {}) } } : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.client.auditLog.count({ where }),
    prisma.client.auditLog.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (query.page - 1) * query.pageSize, take: query.pageSize, select: { id: true, actorUserId: true, action: true, category: true, entityType: true, entityId: true, result: true, severity: true, summary: true, createdAt: true, actorUser: { select: { name: true, email: true } } } }),
  ]);
  return { rows, total, totalPages: Math.max(1, Math.ceil(total / query.pageSize)) };
}

export async function getAuditLog(id: string) {
  await requireAdmin();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  return prisma.client.auditLog.findUnique({ where: { id }, select: { id: true, actorUserId: true, action: true, category: true, entityType: true, entityId: true, result: true, severity: true, summary: true, metadata: true, requestId: true, ipAddress: true, userAgent: true, createdAt: true, actorUser: { select: { name: true, email: true } } } });
}
