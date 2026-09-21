import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { isValidEmail, normalizeEmail } from "@/lib/auth/normalize-email";
import { createUserDatabaseSession } from "@/lib/auth/user-session";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const limit = consumeApiRateLimit(`user-login:${clientRateLimitKey(request)}`, 10, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid email or password." }, { status: 401 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!isValidEmail(email) || !password) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  const user = await prisma.client.user.findUnique({ where: { email }, select: { id: true, passwordHash: true } });
  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid) {
    await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHENTICATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "User credential authentication failed.", actor: { userId: null, type: "SYSTEM" } });
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await createUserDatabaseSession(user.id);
  await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, summary: "User authenticated successfully with email credentials.", actor: { userId: user.id, type: "USER" } });
  return NextResponse.json({ ok: true, redirectTo: "/auth-test" }, { headers: { "Cache-Control": "no-store" } });
}
