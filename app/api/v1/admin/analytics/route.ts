import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { requireApiAdmin } from "@/lib/api/auth";
import { getAdminAnalytics } from "@/lib/admin/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    await requireApiAdmin();
    const url = new URL(request.url);
    const data = await getAdminAnalytics({
      range: url.searchParams.get("range") ?? undefined,
      start: url.searchParams.get("start") ?? undefined,
      end: url.searchParams.get("end") ?? undefined,
      category: url.searchParams.get("category") ?? undefined,
      contentType: url.searchParams.get("contentType") ?? undefined,
    });
    return apiSuccess(data, { headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNAUTHENTICATED") return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    if (code === "FORBIDDEN") return apiError("FORBIDDEN", "Administrator access is required.", 403, requestId);
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
