import { NextResponse } from "next/server";
import { getPublishedServiceBySlug } from "@/lib/services/repository";
import { getPublishedResearchBySlug } from "@/lib/research/repository";
import { getPublishedExpertBySlug } from "@/lib/experts/repository";
import { getPublishedArticleBySlug } from "@/lib/articles/repository";
import { getPublishedEventBySlug } from "@/lib/events/repository";
import { apiError, getRequestId, publicCacheHeaders } from "@/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = new Set(["services", "research", "experts", "articles", "workshops"]);

function validSlug(value: string) {
  return /^[a-z0-9][a-z0-9-]{0,159}$/.test(value);
}

export async function GET(request: Request, { params }: { params: Promise<{ type: string; slug: string }> }) {
  const requestId = getRequestId(request);
  const { type, slug } = await params;
  if (!TYPES.has(type) || !validSlug(slug)) return apiError("VALIDATION_ERROR", "Invalid content path.", 400, requestId);

  try {
    let data: unknown;
    switch (type) {
      case "services": data = await getPublishedServiceBySlug(slug); break;
      case "research": data = await getPublishedResearchBySlug(slug); break;
      case "experts": data = await getPublishedExpertBySlug(slug); break;
      case "articles": data = await getPublishedArticleBySlug(slug); break;
      case "workshops": data = await getPublishedEventBySlug(slug); break;
    }
    if (!data) return apiError("NOT_FOUND", "The requested content was not found.", 404, requestId);
    return NextResponse.json({ data, meta: { requestId, type } }, { headers: { ...publicCacheHeaders(60), "X-Request-Id": requestId } });
  } catch {
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
