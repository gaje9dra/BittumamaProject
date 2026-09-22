import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { isValidEmail, normalizeEmail } from "@/lib/auth/normalize-email";
import { createUserDatabaseSession } from "@/lib/auth/user-session";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
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
  const limit = consumeApiRateLimit(`user-register:${clientRateLimitKey(request)}`, 5, 60 * 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid registration request." }, { status: 400 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : "";
  const password = typeof input.password === "string" ? input.password : "";
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 120) : null;
  if (!isValidEmail(email) || !validatePassword(password)) return NextResponse.json({ error: "Enter a valid email and a password of at least 10 characters." }, { status: 400 });
  const existing = await prisma.client.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return NextResponse.json({ error: "Unable to create the account with those details." }, { status: 400 });
  const passwordHash = await hashPassword(password);
  const user = await prisma.client.user.create({ data: { email, name: name || null, passwordHash }, select: { id: true } });
  await createUserDatabaseSession(user.id);
  await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, summary: "New user account created with email credentials.", actor: { userId: user.id, type: "USER" } });
  return NextResponse.json({ ok: true, redirectTo: "/account" }, { headers: { "Cache-Control": "no-store" } });
}
