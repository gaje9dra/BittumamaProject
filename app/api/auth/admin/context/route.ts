import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
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
  store.set(ADMIN_CONTEXT_COOKIE, "", { ...adminContextCookieOptions, maxAge: 0 });

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE() {
  const session = await auth();
  if (session?.user?.id) {
    await recordAuditBestEffort(prisma.client, {
      action: AuditAction.AUTH_LOGOUT,
      category: AuditCategory.AUTHENTICATION,
      result: AuditResult.SUCCESS,
      summary: "Authentication context cleared during logout.",
      actor: { userId: session.user.id, type: "USER" },
    });
  }
  const store = await cookies();
  store.set(ADMIN_INTENT_COOKIE, "", { ...adminIntentCookieOptions, maxAge: 0 });
  store.set(ADMIN_CONTEXT_COOKIE, "", { ...adminContextCookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
