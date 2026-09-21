import "server-only";

import { NotificationChannel, NotificationStatus, NotificationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getNotificationConfig, normalizeRecipient } from "@/lib/notifications/config";
import { getEmailProvider } from "@/lib/notifications/provider";
import { buildNotificationTemplate } from "@/lib/notifications/templates";
import { EmailDeliveryError, type NotificationPayload } from "@/lib/notifications/types";
import { assertNotificationTransition } from "@/lib/notifications/state";
import { getNotification } from "@/lib/notifications/repository";

function payloadFor(record: { type: NotificationType; payload: unknown }): NotificationPayload {
  if (!record.payload || typeof record.payload !== "object" || Array.isArray(record.payload)) throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload is invalid.");
  const value = record.payload as Record<string, unknown>;
  if (value.type !== record.type) throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload type is invalid.");
  if (typeof value.type !== "string") throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload type is invalid.");
  const required = record.type === "INQUIRY_RECEIVED"
    ? ["name", "email", "messagePreview"]
    : record.type.startsWith("REGISTRATION_")
      ? ["name", "eventTitle", "status"]
      : ["reference", "amount", "currency", "purpose", "status"];
  for (const key of required) if (typeof value[key] !== "string") throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload is incomplete.");
  if (record.type === "INQUIRY_RECEIVED" && value.serviceTitle !== null && typeof value.serviceTitle !== "string") throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload is invalid.");
  if (record.type.startsWith("REGISTRATION_") && value.eventDate !== null && typeof value.eventDate !== "string") throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload is invalid.");
  if (record.type === "PAYMENT_FAILED" && value.failureMessage !== null && typeof value.failureMessage !== "string") throw new EmailDeliveryError("PERMANENT", "INVALID_PAYLOAD", "Notification payload is invalid.");
  return value as unknown as NotificationPayload;
}


export async function deliverNotification(notificationId: string) {
  assertNotificationTransition(NotificationStatus.PENDING, NotificationStatus.PROCESSING);
  const claimed = await prisma.client.notification.updateMany({
    where: { id: notificationId, status: NotificationStatus.PENDING },
    data: { status: NotificationStatus.PROCESSING },
  });
  if (claimed.count !== 1) return { delivered: false, reason: "NOT_PENDING" as const };

  const record = await getNotification(notificationId);
  if (!record) return { delivered: false, reason: "NOT_FOUND" as const };

  try {
    const config = getNotificationConfig();
    if (!config) throw new EmailDeliveryError("PERMANENT", "EMAIL_NOT_CONFIGURED", "Transactional email is not configured.");
    if (record.channel !== NotificationChannel.EMAIL) throw new EmailDeliveryError("PERMANENT", "UNSUPPORTED_CHANNEL", "Notification channel is not supported.");
    const recipient = normalizeRecipient(record.recipient);
    const payload = payloadFor(record);
    const template = buildNotificationTemplate(payload);
    const provider = getEmailProvider();
    const result = await provider.send({
      to: recipient,
      subject: template.subject,
      text: template.text,
      html: template.html,
      idempotencyKey: record.dedupeKey,
      ...(config.replyTo ? { replyTo: config.replyTo } : {}),
    });
    assertNotificationTransition(NotificationStatus.PROCESSING, NotificationStatus.SENT);
    await prisma.client.notification.update({
      where: { id: record.id },
      data: { status: NotificationStatus.SENT, provider: result.provider, providerMessageId: result.providerMessageId, sentAt: new Date(), failedAt: null, failureCode: null, failureMessage: null },
    });
    return { delivered: true as const, providerMessageId: result.providerMessageId };
  } catch (error) {
    const deliveryError = error instanceof EmailDeliveryError ? error : new EmailDeliveryError("TEMPORARY", "UNEXPECTED_EMAIL_ERROR", "Unexpected email delivery error.");
    assertNotificationTransition(NotificationStatus.PROCESSING, NotificationStatus.FAILED);
    await prisma.client.notification.update({
      where: { id: record.id },
      data: { status: NotificationStatus.FAILED, failedAt: new Date(), failureCode: deliveryError.code, failureMessage: deliveryError.message },
    });
    if (process.env.NODE_ENV !== "production") console.error("Notification delivery failed:", { notificationId: record.id, code: deliveryError.code, kind: deliveryError.kind });
    return { delivered: false as const, reason: deliveryError.kind, code: deliveryError.code };
  }
}

const NON_RETRYABLE_FAILURES = new Set(["EMAIL_NOT_CONFIGURED", "INVALID_PAYLOAD", "UNSUPPORTED_CHANNEL"]);

export async function retryNotification(notificationId: string) {
  const existing = await getNotification(notificationId);
  if (!existing || existing.status !== NotificationStatus.FAILED || (existing.failureCode && NON_RETRYABLE_FAILURES.has(existing.failureCode))) {
    return { ok: false as const, reason: "NOT_RETRYABLE" as const };
  }
  assertNotificationTransition(NotificationStatus.FAILED, NotificationStatus.PENDING);
  const updated = await prisma.client.notification.updateMany({
    where: { id: notificationId, status: NotificationStatus.FAILED },
    data: { status: NotificationStatus.PENDING, failedAt: null, failureCode: null, failureMessage: null },
  });
  if (updated.count !== 1) return { ok: false as const, reason: "NOT_RETRYABLE" as const };
  return deliverNotification(notificationId);
}

export async function createAndDeliverNotification(tx: Parameters<typeof prisma.client.$transaction>[0] extends never ? never : never) {
  return tx;
}