import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  ADMIN_CONTEXT_COOKIE,
  ADMIN_INTENT_COOKIE,
  adminContextCookieOptions,
  isValidAdminIntent,
  createAdminContextToken,
} from "@/lib/auth/admin-context";
import { recordAuditBestEffort } from "@/lib/audit/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";

function safeAdminCallback(value: string | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  try {
    const url = new URL(value, "https://bittumama.invalid");
    if (url.origin !== "https://bittumama.invalid" || !url.pathname.startsWith("/admin")) return "/admin";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin";
  }
}

export default async function AdminLoginCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeAdminCallback(params.callbackUrl);
  const store = await cookies();
  const intent = store.get(ADMIN_INTENT_COOKIE)?.value;
  const user = await getCurrentUser();

  if (!user?.id || !isValidAdminIntent(intent)) {
    store.delete(ADMIN_INTENT_COOKIE);
    store.delete(ADMIN_CONTEXT_COOKIE);
    redirect("/admin/login?error=unauthorized");
  }

  const account = await prisma.client.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true },
  });

  if (!account || account.role !== "ADMIN") {
    await recordAuditBestEffort(prisma.client, {
      action: AuditAction.AUTH_LOGIN_FAILED,
      category: AuditCategory.AUTHORIZATION,
      result: AuditResult.FAILURE,
      severity: AuditSeverity.WARNING,
      summary: "Administrator authentication context rejected by server-side authorization.",
      actor: { userId: account?.id ?? null, type: account ? "USER" : "SYSTEM" },
    });
    store.delete(ADMIN_INTENT_COOKIE);
    store.delete(ADMIN_CONTEXT_COOKIE);
    redirect("/admin/login?error=unauthorized");
  }

  store.set(ADMIN_CONTEXT_COOKIE, createAdminContextToken(), adminContextCookieOptions);
  store.delete(ADMIN_INTENT_COOKIE);

  await recordAuditBestEffort(prisma.client, {
    action: AuditAction.AUTH_LOGIN,
    category: AuditCategory.AUTHORIZATION,
    result: AuditResult.SUCCESS,
    summary: "Administrator authentication context established.",
    actor: { userId: account.id, type: "USER" },
  });

  redirect(callbackUrl);
}
