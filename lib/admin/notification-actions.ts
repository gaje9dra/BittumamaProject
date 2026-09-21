"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { retryNotification } from "@/lib/notifications/service";
import { prisma } from "@/lib/db/prisma";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
import { recordAuditBestEffort } from "@/lib/audit/service";

export type NotificationActionState = { message: string | null; error: string | null };
export const notificationActionInitialState: NotificationActionState = { message: null, error: null };

export async function retryNotificationAsAdmin(
  _previous: NotificationActionState,
  formData: FormData,
): Promise<NotificationActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { message: null, error: "Invalid notification." };
  try {
    const result = await retryNotification(id);
    await recordAuditBestEffort(prisma.client, { action: AuditAction.NOTIFICATION_RETRIED, category: AuditCategory.NOTIFICATION, result: ("ok" in result && !result.ok) ? AuditResult.FAILURE : AuditResult.SUCCESS, summary: "Notification retry requested by administrator.", entityType: "Notification", entityId: id, metadata: { notificationId: id }, actor: { userId: actor.id, type: "USER" } });
    revalidatePath("/admin/notifications");
    revalidatePath("/admin/notifications/" + id);
    if ("ok" in result && !result.ok) return { message: null, error: "This notification is not eligible for retry." };
    return "delivered" in result && result.delivered
      ? { message: "Notification delivered.", error: null }
      : { message: null, error: "Retry did not deliver the notification." };
  } catch {
    return { message: null, error: "Unable to retry this notification." };
  }
}