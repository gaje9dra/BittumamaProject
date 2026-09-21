import "server-only";

import { NotificationStatus, NotificationType } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { getNotification, listAdminNotifications } from "@/lib/notifications/repository";

export async function listNotificationsForAdmin(options: { q?: string; status?: NotificationStatus; type?: NotificationType; page?: number; pageSize?: number } = {}) {
  await requireAdmin();
  return listAdminNotifications(options);
}

export async function getNotificationForAdmin(id: string) {
  await requireAdmin();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  return getNotification(id);
}