import "server-only";

import type { NotificationStatus } from "@/generated/prisma/client";

const transitions: Record<NotificationStatus, readonly NotificationStatus[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SENT", "FAILED"],
  SENT: [],
  FAILED: ["PENDING"],
  CANCELLED: [],
};

export function canTransitionNotification(from: NotificationStatus, to: NotificationStatus) {
  return transitions[from].includes(to);
}

export function assertNotificationTransition(from: NotificationStatus, to: NotificationStatus) {
  if (!canTransitionNotification(from, to)) throw new Error("INVALID_NOTIFICATION_TRANSITION");
}