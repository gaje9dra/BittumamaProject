import { NextResponse } from "next/server";
import { AnalyticsEventCategory, AnalyticsEventName } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { trackAnalyticsEvent } from "@/lib/analytics/service";
import { resolvePublicContent } from "@/lib/analytics/service";
import { isValidAnalyticsId, isValidAnalyticsAnonymousId, normalizeAnalyticsPath } from "@/lib/analytics/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_MINUTE = 60;

function limited(key: string) {
  const now = Date.now();
  const current = rateLimit.get(key);
  if (!current || current.resetAt <= now) { rateLimit.set(key, { count: 1, resetAt: now + 60000 }); return false; }
  if (current.count >= MAX_PER_MINUTE) return true;
  current.count += 1;
  return false;
}

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ accepted: false }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return NextResponse.json({ accepted: false }, { status: 400 });
  const raw = payload as Record<string, unknown>;
  const eventName = raw.eventName;
  const path = typeof raw.path === "string" ? normalizeAnalyticsPath(raw.path) : null;
  const anonymousId = typeof raw.anonymousId === "string" ? raw.anonymousId : null;
  const sessionId = typeof raw.sessionId === "string" ? raw.sessionId : null;
  if (eventName !== "PAGE_VIEW" && eventName !== "REGISTRATION_STARTED") return NextResponse.json({ accepted: false }, { status: 422 });
  if (!path) return NextResponse.json({ accepted: false }, { status: 422 });
  if (anonymousId && !isValidAnalyticsAnonymousId(anonymousId)) return NextResponse.json({ accepted: false }, { status: 422 });
  if (sessionId && !isValidAnalyticsAnonymousId(sessionId)) return NextResponse.json({ accepted: false }, { status: 422 });
  if (limited(sessionId ?? anonymousId ?? "anonymous")) return NextResponse.json({ accepted: false }, { status: 429 });

  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    if (eventName === "REGISTRATION_STARTED") {
      const eventId = typeof raw.eventId === "string" ? raw.eventId : "";
      if (!isValidAnalyticsId(eventId)) return NextResponse.json({ accepted: false }, { status: 422 });
      const event = await prisma.client.event.findFirst({ where: { id: eventId, status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }], registrationEnabled: true }, select: { id: true } });
      if (!event) return NextResponse.json({ accepted: false }, { status: 422 });
      await trackAnalyticsEvent({ eventName: AnalyticsEventName.REGISTRATION_STARTED, eventCategory: AnalyticsEventCategory.CONVERSION, userId, anonymousId, sessionId, path, contentType: "WORKSHOP", contentId: event.id, metadata: { eventId: event.id } });
      return NextResponse.json({ accepted: true });
    }

    const content = await resolvePublicContent(path);
    if (content) {
      await trackAnalyticsEvent({ eventName: content.eventName, eventCategory: AnalyticsEventCategory.CONTENT, userId, anonymousId, sessionId, path, contentType: content.contentType, contentId: content.contentId, metadata: { path } });
    } else {
      await trackAnalyticsEvent({ eventName: AnalyticsEventName.PAGE_VIEW, eventCategory: AnalyticsEventCategory.PAGE, userId, anonymousId, sessionId, path });
    }
    return NextResponse.json({ accepted: true });
  } catch {
    return NextResponse.json({ accepted: true });
  }
}
