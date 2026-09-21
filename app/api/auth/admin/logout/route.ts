import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { destroyCurrentAdminSession, getCurrentAdminSession } from "@/lib/auth/admin-session";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const admin = await getCurrentAdminSession();
  await destroyCurrentAdminSession();
  if (admin) await recordAuditBestEffort(prisma.client, { action: AuditAction.AUTH_LOGOUT, category: AuditCategory.AUTHENTICATION, result: AuditResult.SUCCESS, entityType: "AdminAccount", entityId: admin.id, summary: "Administrator logged out.", actor: { userId: null, type: "SYSTEM" } });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
