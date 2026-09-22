import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword, hashPassword, validatePassword } from "@/lib/auth/password";
import { requireApiUser } from "@/lib/api/auth";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
import { clientRateLimitKey, consumeApiRateLimit } from "@/lib/api/rate-limit";
import { createUserDatabaseSession } from "@/lib/auth/user-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });

  const limit = consumeApiRateLimit(`change-password:${clientRateLimitKey(request)}`, 5, 15 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds), "Cache-Control": "no-store" } },
    );
  }

  let actor;
  try {
    actor = await requireApiUser();
  } catch {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid password change request." }, { status: 400 });
  }

  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const currentPassword = typeof input.currentPassword === "string" ? input.currentPassword : "";
  const newPassword = typeof input.newPassword === "string" ? input.newPassword : "";
  const confirmPassword = typeof input.confirmPassword === "string" ? input.confirmPassword : "";

  if (!currentPassword) return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
  if (!validatePassword(newPassword)) return NextResponse.json({ error: "Use a password between 10 and 200 characters." }, { status: 400 });
  if (newPassword !== confirmPassword) return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
  if (newPassword === currentPassword) return NextResponse.json({ error: "Choose a new password." }, { status: 400 });

  const user = await prisma.client.user.findUnique({
    where: { id: actor.id },
    select: { id: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ error: "Your account uses Google sign-in." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    await recordAuditBestEffort(prisma.client, {
      action: AuditAction.AUTH_LOGIN_FAILED,
      category: AuditCategory.AUTHENTICATION,
      result: AuditResult.FAILURE,
      summary: "User password change was rejected because the current password was incorrect.",
      actor: { userId: actor.id, type: "USER" },
    });
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.client.$transaction(async (tx) => {
    await tx.user.update({ where: { id: actor.id }, data: { passwordHash } });
    await tx.session.deleteMany({ where: { userId: actor.id } });
  });
  await createUserDatabaseSession(actor.id);

  await recordAuditBestEffort(prisma.client, {
    action: AuditAction.USER_SECURITY_CHANGED,
    category: AuditCategory.AUTHENTICATION,
    result: AuditResult.SUCCESS,
    summary: "User password changed successfully.",
    actor: { userId: actor.id, type: "USER" },
  });

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
