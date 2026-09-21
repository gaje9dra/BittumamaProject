import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { requireApiAdmin } from "@/lib/api/auth";
import { getAuditLogs, parseAuditQuery } from "@/lib/admin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    await requireApiAdmin();
    const url = new URL(request.url);
    const query = parseAuditQuery(Object.fromEntries(url.searchParams.entries()));
    const result = await getAuditLogs(query);
    const data = result.rows.map((row) => ({
      id: row.id,
      actorUserId: row.actorUserId,
      actor: row.actorUser,
      action: row.action,
      category: row.category,
      entityType: row.entityType,
      entityId: row.entityId,
      result: row.result,
      severity: row.severity,
      summary: row.summary,
      createdAt: row.createdAt,
    }));
    return apiSuccess(data, { meta: { page: query.page, pageSize: query.pageSize, total: result.total, totalPages: result.totalPages, requestId }, headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNAUTHENTICATED") return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    if (code === "FORBIDDEN") return apiError("FORBIDDEN", "Administrator access is required.", 403, requestId);
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
