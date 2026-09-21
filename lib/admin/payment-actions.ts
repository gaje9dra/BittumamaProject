"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminPayment } from "@/lib/payments/repository";
import { getConfiguredPaymentProvider } from "@/lib/payments/provider";
import { reconcileVerifiedPayment } from "@/lib/payments/service";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { recordAuditBestEffort } from "@/lib/audit/service";

export type PaymentReconciliationState = { message: string | null; error: string | null };
export const paymentReconciliationInitialState: PaymentReconciliationState = { message: null, error: null };

export async function reconcilePaymentAsAdmin(
  _previous: PaymentReconciliationState,
  formData: FormData,
): Promise<PaymentReconciliationState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { message: null, error: "Invalid payment." };

  try {
    const payment = await getAdminPayment(id);
    if (!payment) return { message: null, error: "Payment not found." };
    const provider = getConfiguredPaymentProvider();
    if (provider.name !== payment.provider) return { message: null, error: "The configured provider does not match this payment." };
    const verified = await provider.reconcile(payment.reference);
    const result = await reconcileVerifiedPayment(verified, actor.id);
    if (result.ok) await recordAuditBestEffort(prisma.client, { action: AuditAction.PAYMENT_RECONCILED, category: AuditCategory.PAYMENT, result: AuditResult.SUCCESS, summary: "Payment reconciled against verified provider state.", entityType: "PaymentTransaction", entityId: payment.id, metadata: { paymentTransactionId: payment.id, changed: result.changed }, actor: { userId: actor.id, type: "USER" } });
    if (!result.ok) { await recordAuditBestEffort(prisma.client, { action: AuditAction.PAYMENT_RECONCILED, category: AuditCategory.PAYMENT, result: AuditResult.FAILURE, severity: AuditSeverity.WARNING, summary: "Payment reconciliation mismatch.", entityType: "PaymentTransaction", entityId: payment.id, metadata: { paymentTransactionId: payment.id, reason: result.reason }, actor: { userId: actor.id, type: "USER" } }); return { message: null, error: "Provider reconciliation found a payment mismatch." }; }

    revalidatePath("/admin/payments");
    revalidatePath("/admin/payments/" + id);
    revalidatePath("/account/payments");
    if (payment.event?.slug) revalidatePath("/workshops/" + payment.event.slug);
    return { message: result.changed ? "Payment reconciled from verified provider state." : "Payment is already synchronized.", error: null };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Admin payment reconciliation failed:", error);
    return { message: null, error: "Unable to reconcile this payment." };
  }
}