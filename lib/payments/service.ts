import "server-only";

import { PaymentStatus, PaymentPurpose } from "@/generated/prisma/client";

const PAYMENT_NOTIFICATION_STATUSES: PaymentStatus[] = [PaymentStatus.SUCCESS, PaymentStatus.FAILED, PaymentStatus.PENDING];
import { getCurrentUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { assertAmountMinor, normalizeCurrency, minorToMajorString } from "@/lib/payments/money";
import { deliverCreatedNotifications, queuePaymentNotification } from "@/lib/notifications/domain";
import { getConfiguredPaymentProvider, getConfiguredPaymentProviderName } from "@/lib/payments/provider";
import { AnalyticsEventCategory, AnalyticsEventName } from "@/generated/prisma/client";
import { trackAnalyticsEvent } from "@/lib/analytics/service";
import { assertPaymentTransition } from "@/lib/payments/state";
import { createPaymentTransaction, getPaymentByReference } from "@/lib/payments/repository";
import type { ResolvedPaymentTarget, VerifiedPayment } from "@/lib/payments/types";

function validId(value: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

export function buildIdempotencyKey(userId: string, target: ResolvedPaymentTarget, requestId: string) {
  if (!validId(userId) || !validId(requestId)) throw new Error("Invalid payment identity.");
  return [userId, target.purpose, target.eventId ?? target.serviceId ?? target.registrationId ?? "target", requestId].join(":");
}

export async function createServerPayment(target: ResolvedPaymentTarget, requestId: string) {
  const user = await getCurrentUser();
  if (!user || user.id !== target.userId) throw new Error("AUTHENTICATION_REQUIRED");
  assertAmountMinor(target.amountMinor);
  const currency = normalizeCurrency(target.currency);
  const provider = getConfiguredPaymentProviderName();
  if (!provider) throw new Error("PAYMENT_PROVIDER_NOT_CONFIGURED");
  const result = await createPaymentTransaction({ userId: user.id, target, amountMinor: target.amountMinor, currency, provider, idempotencyKey: buildIdempotencyKey(user.id, target, requestId), description: target.description });
  if (result.created) await trackAnalyticsEvent({ eventName: AnalyticsEventName.PAYMENT_INITIATED, eventCategory: AnalyticsEventCategory.CONVERSION, userId: user.id, contentType: target.eventId ? "WORKSHOP" : undefined, contentId: target.eventId ?? undefined, metadata: { paymentTransactionId: result.transaction.id, purpose: target.purpose, currency } });
  return result;
}

export async function initiateCheckout(reference: string, returnUrl: string) {
  const transaction = await getPaymentByReference(reference);
  if (!transaction) throw new Error("PAYMENT_NOT_FOUND");
  const user = await getCurrentUser();
  if (!user || user.id !== transaction.userId) throw new Error("FORBIDDEN");
  if (transaction.status !== PaymentStatus.CREATED && transaction.status !== PaymentStatus.PENDING) throw new Error("PAYMENT_NOT_CHECKOUT_ELIGIBLE");

  const provider = getConfiguredPaymentProvider();
  const response = await provider.createCheckout({
    reference: transaction.reference,
    amountMinor: transaction.amountMinor,
    currency: transaction.currency,
    description: transaction.description ?? "Bittumama payment",
    customer: { name: user.name?.trim() || "Customer", email: user.email ?? "" },
    returnUrl,
  });

  await prisma.client.paymentTransaction.updateMany({
    where: { id: transaction.id, status: PaymentStatus.CREATED },
    data: { status: PaymentStatus.PENDING, providerTransactionId: response.providerTransactionId ?? undefined },
  });
  return response;
}

export async function reconcileVerifiedPayment(verified: VerifiedPayment) {
  const transaction = await prisma.client.paymentTransaction.findUnique({ where: { reference: verified.reference } });
  if (!transaction) throw new Error("PAYMENT_NOT_FOUND");
  if (normalizeCurrency(verified.currency) !== transaction.currency || verified.amountMinor !== transaction.amountMinor) {
    console.error("Payment reconciliation mismatch:", { reference: transaction.reference, provider: transaction.provider });
    return { ok: false as const, reason: "PAYMENT_MISMATCH" as const };
  }
  if (verified.providerTransactionId && transaction.providerTransactionId && verified.providerTransactionId !== transaction.providerTransactionId) {
    return { ok: false as const, reason: "PROVIDER_REFERENCE_MISMATCH" as const };
  }
  if (transaction.status === verified.status) return { ok: true as const, changed: false as const, transaction };
  assertPaymentTransition(transaction.status, verified.status);

  const data = {
    status: verified.status,
    providerTransactionId: verified.providerTransactionId ?? transaction.providerTransactionId,
    failureCode: verified.failureCode ?? null,
    failureMessage: verified.failureMessage ?? null,
    paidAt: verified.status === PaymentStatus.SUCCESS ? new Date() : null,
  };

  const notificationIds: string[] = [];
  const result = await prisma.client.$transaction(async (tx) => {
    const current = await tx.paymentTransaction.findUnique({ where: { id: transaction.id } });
    if (!current) throw new Error("PAYMENT_NOT_FOUND");
    if (current.status === verified.status) return current;
    assertPaymentTransition(current.status, verified.status);

    const updated = await tx.paymentTransaction.update({ where: { id: current.id }, data });
    if (verified.status === PaymentStatus.SUCCESS && updated.registrationId) {
      await tx.eventRegistration.updateMany({
        where: { id: updated.registrationId, status: { in: ["PENDING", "CONFIRMED"] } },
        data: { status: "CONFIRMED" },
      });
    }

    if (updated.userId && PAYMENT_NOTIFICATION_STATUSES.includes(verified.status)) {
      const user = await tx.user.findUnique({ where: { id: updated.userId }, select: { email: true } });
      if (user?.email) {
        const notification = await queuePaymentNotification(tx, {
          paymentId: updated.id,
          userId: updated.userId,
          recipient: user.email,
          type: verified.status === PaymentStatus.SUCCESS ? "PAYMENT_SUCCESS" : verified.status === PaymentStatus.FAILED ? "PAYMENT_FAILED" : "PAYMENT_PENDING",
          reference: updated.reference,
          amount: minorToMajorString(updated.amountMinor),
          currency: updated.currency,
          purpose: updated.purpose,
          status: updated.status,
          failureMessage: updated.failureMessage,
        });
        if (notification) notificationIds.push(notification.notificationId);
      }
    }
    return updated;
  });
  if (verified.status === PaymentStatus.SUCCESS || verified.status === PaymentStatus.FAILED) await trackAnalyticsEvent({ eventName: verified.status === PaymentStatus.SUCCESS ? AnalyticsEventName.PAYMENT_SUCCESS : AnalyticsEventName.PAYMENT_FAILED, eventCategory: AnalyticsEventCategory.CONVERSION, userId: result.userId, contentType: result.eventId ? "WORKSHOP" : undefined, contentId: result.eventId ?? undefined, metadata: { paymentTransactionId: result.id, purpose: result.purpose, currency: result.currency } });
  await deliverCreatedNotifications(notificationIds);
  return { ok: true as const, changed: true as const, transaction: result };
}

export async function resolvePayableTarget(_purpose: PaymentPurpose, _targetId: string, _userId: string): Promise<ResolvedPaymentTarget> {
  // Phase 8.17 deliberately does not invent service/event pricing. A future pricing phase
  // can implement this resolver without changing the transaction/provider architecture.
  throw new Error("PAYMENT_TARGET_NOT_CONFIGURED");
}