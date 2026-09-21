import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { requireApiUser } from "@/lib/api/auth";
import { listUserRegistrations } from "@/lib/events/registration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pageValue(value: string | null) { const n = Number(value ?? "1"); return Number.isInteger(n) && n >= 1 && n <= 100 ? n : 1; }
function sizeValue(value: string | null) { const n = Number(value ?? "20"); return Number.isInteger(n) && n >= 5 && n <= 50 ? n : 20; }

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    const user = await requireApiUser();
    const url = new URL(request.url);
    const result = await listUserRegistrations(user.id, pageValue(url.searchParams.get("page")), sizeValue(url.searchParams.get("pageSize")));
    return apiSuccess(result.items, { meta: { page: result.page, pageSize: result.pageSize, total: result.total, totalPages: result.totalPages, requestId }, headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return code === "UNAUTHENTICATED" ? apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId) : apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
