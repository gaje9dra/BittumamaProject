import { NextResponse } from "next/server";
import { searchContent } from "@/lib/search";
import { normalizeSearchQuery, parseSearchFilters } from "@/lib/search/validation";
import { apiError, apiSuccess, getRequestId, publicCacheHeaders } from "@/lib/api/response";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const limit = consumeApiRateLimit(clientRateLimitKey(request), 60, 60_000);
  if (!limit.allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", 429, requestId, { retryAfterSeconds: limit.retryAfterSeconds });
  }

  const url = new URL(request.url);
  const query = normalizeSearchQuery(url.searchParams.get("q"));
  if (!query) return apiError("VALIDATION_ERROR", "A search query between 2 and 160 characters is required.", 400, requestId);

  const filters = parseSearchFilters(url.searchParams.get("type"), url.searchParams.get("page"), url.searchParams.get("pageSize"));
  try {
    const result = await searchContent({ query, ...filters });
    if (!result) return apiError("VALIDATION_ERROR", "A valid search query is required.", 400, requestId);
    return NextResponse.json({ data: result.results, meta: { ...result.pagination, query: result.query, filters: result.filters, requestId } }, { headers: { ...publicCacheHeaders(30), "X-Request-Id": requestId } });
  } catch {
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
