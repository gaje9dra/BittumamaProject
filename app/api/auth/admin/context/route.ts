import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";
import {
  ADMIN_CONTEXT_COOKIE,
  ADMIN_INTENT_COOKIE,
  adminContextCookieOptions,
  adminIntentCookieOptions,
  createAdminIntentToken,
} from "@/lib/auth/admin-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = consumeApiRateLimit(`admin-login:${clientRateLimitKey(request)}`, 5, 10 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many administrator login attempts. Please try again later." } },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const store = await cookies();
  store.set(ADMIN_INTENT_COOKIE, createAdminIntentToken(), adminIntentCookieOptions);
  store.delete(ADMIN_CONTEXT_COOKIE);

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_INTENT_COOKIE);
  store.delete(ADMIN_CONTEXT_COOKIE);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
