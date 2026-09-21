import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { isValidEmail, normalizeEmail } from "@/lib/auth/normalize-email";
import { createAdminSession } from "@/lib/auth/admin-session";
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
  const limit = consumeApiRateLimit(`admin-login:${clientRateLimitKey(request)}`, 5, 10 * 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many administrator login attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!isValidEmail(email) || !password) return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401 });
  const admin = await prisma.client.adminAccount.findUnique({ where: { normalizedEmail: email }, select: { id: true, email: true, passwordHash: true, isActive: true } });
  const valid = await verifyPassword(password, admin?.passwordHash);
  if (!admin || !admin.isActive || !valid) {
    await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN_FAILED, category: AuditCategory.AUTHENTICATION, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Administrator credential authentication failed.", entityType: "AdminAccount", entityId: admin?.id ?? null, actor: { userId: null, type: "SYSTEM" } });
    return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await createAdminSession(admin.id);
  await prisma.client.adminAccount.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGIN, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, entityType: "AdminAccount", entityId: admin.id, summary: "Administrator authenticated successfully.", actor: { userId: null, type: "SYSTEM" } });
  return NextResponse.json({ ok: true, redirectTo: "/admin" }, { headers: { "Cache-Control": "no-store" } });
}
