import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { destroyCurrentAdminSession, getCurrentAdminSession } from "@/lib/auth/admin-session";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const admin = await getCurrentAdminSession();
  await destroyCurrentAdminSession();
  if (admin) await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGOUT, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, entityType: "AdminAccount", entityId: admin.id, summary: "Administrator logged out.", actor: { userId: null, type: "SYSTEM" } });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
