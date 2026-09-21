import { apiError, apiSuccess, getRequestId } from "@/lib/api/response";
import { requireApiUser } from "@/lib/api/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    const user = await requireApiUser();
    return apiSuccess({ id: user.id, name: user.name ?? null, email: user.email ?? null, role: user.role ?? null }, { headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNAUTHENTICATED") return apiError("UNAUTHENTICATED", "Authentication is required.", 401, requestId);
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
