import { NextResponse } from "next/server";
import { getPublishedEventBySlug } from "@/lib/events/repository";
import { getRegistrationAvailability } from "@/lib/events/registration";
import { getApiActor } from "@/lib/api/auth";
import { apiError, getRequestId, publicCacheHeaders } from "@/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const requestId = getRequestId(request);
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9-]{0,159}$/.test(slug)) return apiError("VALIDATION_ERROR", "Invalid event slug.", 400, requestId);
  try {
    const event = await getPublishedEventBySlug(slug);
    if (!event) return apiError("NOT_FOUND", "The requested event was not found.", 404, requestId);
    const actor = await getApiActor();
    const availability = await getRegistrationAvailability(event.id, actor?.id);
    const data = {
      ...event,
      registrationAvailability: {
        open: availability.open,
        reason: availability.reason,
        capacity: availability.capacity,
        remaining: availability.remaining,
        mode: availability.mode,
      },
    };
    return NextResponse.json({ data, meta: { requestId } }, { headers: { ...publicCacheHeaders(30), "X-Request-Id": requestId } });
  } catch {
    return apiError("INTERNAL_ERROR", "An unexpected error occurred.", 500, requestId);
  }
}
