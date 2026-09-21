import "server-only";

import { NotificationChannel, NotificationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getNotificationConfig, normalizeRecipient } from "@/lib/notifications/config";
import { buildNotificationTemplate } from "@/lib/notifications/templates";
import { deliverNotification } from "@/lib/notifications/service";
import { createNotificationIntent, type NotificationTx } from "@/lib/notifications/repository";
import type { NotificationPayload } from "@/lib/notifications/types";

export async function queueNotification(
  tx: NotificationTx,
  input: {
    userId?: string | null;
    type: NotificationType;
    recipient: string;
    relatedEntityType: string;
    relatedEntityId: string;
    payload: NotificationPayload;
    dedupeKey: string;
  },
) {
  const config = getNotificationConfig();
  if (!config) return null;
  const recipient = normalizeRecipient(input.recipient);
  const subject = buildNotificationTemplate(input.payload).subject;
  return createNotificationIntent(tx, {
    userId: input.userId ?? null,
    type: input.type,
    channel: NotificationChannel.EMAIL,
    recipient,
    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,
    payload: input.payload,
    dedupeKey: input.dedupeKey,
    subject,
  });
}

export async function queueInternalInquiryNotification(
  tx: NotificationTx,
  inquiry: { id: string; name: string; email: string; message: string; serviceTitle: string | null },
) {
  const config = getNotificationConfig();
  if (!config || config.internalRecipients.length === 0) return [];
  const created: string[] = [];
  for (const recipient of config.internalRecipients) {
    const result = await queueNotification(tx, {
      type: NotificationType.INQUIRY_RECEIVED,
      recipient,
      relatedEntityType: "ContactInquiry",
      relatedEntityId: inquiry.id,
      payload: { type: "INQUIRY_RECEIVED", name: inquiry.name, email: inquiry.email, serviceTitle: inquiry.serviceTitle, messagePreview: inquiry.message },
      dedupeKey: `inquiry-received:${inquiry.id}:${recipient}`,
    });
    if (result) created.push(result.notificationId);
  }
  return created;
}

export async function queueRegistrationNotification(
  tx: NotificationTx,
  input: { registrationId: string; userId: string | null; recipient: string; type: "REGISTRATION_RECEIVED" | "REGISTRATION_CONFIRMED" | "REGISTRATION_CANCELLED"; name: string; eventTitle: string; eventDate: string | null; status: string },
) {
  return queueNotification(tx, {
    userId: input.userId,
    type: input.type === "REGISTRATION_RECEIVED" ? NotificationType.REGISTRATION_RECEIVED : input.type === "REGISTRATION_CONFIRMED" ? NotificationType.REGISTRATION_CONFIRMED : NotificationType.REGISTRATION_CANCELLED,
    recipient: input.recipient,
    relatedEntityType: "EventRegistration",
    relatedEntityId: input.registrationId,
    payload: { type: input.type, name: input.name, eventTitle: input.eventTitle, eventDate: input.eventDate, status: input.status },
    dedupeKey: `${input.type.toLowerCase()}:${input.registrationId}`,
  });
}

export async function queuePaymentNotification(
  tx: NotificationTx,
  input: { paymentId: string; userId: string; recipient: string; type: "PAYMENT_SUCCESS" | "PAYMENT_FAILED" | "PAYMENT_PENDING"; reference: string; amount: string; currency: string; purpose: string; status: string; failureMessage?: string | null },
) {
  const type = input.type === "PAYMENT_SUCCESS" ? NotificationType.PAYMENT_SUCCESS : input.type === "PAYMENT_FAILED" ? NotificationType.PAYMENT_FAILED : NotificationType.PAYMENT_PENDING;
  const payload = input.type === "PAYMENT_FAILED"
    ? { type: input.type, reference: input.reference, amount: input.amount, currency: input.currency, purpose: input.purpose, status: input.status, failureMessage: input.failureMessage ?? null }
    : { type: input.type, reference: input.reference, amount: input.amount, currency: input.currency, purpose: input.purpose, status: input.status };
  return queueNotification(tx, {
    userId: input.userId,
    type,
    recipient: input.recipient,
    relatedEntityType: "PaymentTransaction",
    relatedEntityId: input.paymentId,
    payload,
    dedupeKey: `${input.type.toLowerCase()}:${input.paymentId}`,
  });
}

export async function deliverCreatedNotifications(ids: string[]) {
  const results = [];
  for (const id of ids) results.push(await deliverNotification(id));
  return results;
}

export async function createNotificationForTest(input: {
  type: NotificationType;
  recipient: string;
  dedupeKey: string;
  payload: NotificationPayload;
}) {
  return prisma.client.$transaction(async (tx) => queueNotification(tx, { ...input, relatedEntityType: "Test", relatedEntityId: "test" }));
}