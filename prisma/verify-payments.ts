import "dotenv/config";

import { PaymentPurpose, PaymentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { assertAmountMinor, majorToMinor, minorToMajorString } from "@/lib/payments/money";
import { assertPaymentTransition } from "@/lib/payments/state";
import { createPaymentTransaction, getPaymentByReference, listUserPayments } from "@/lib/payments/repository";
import { reconcileVerifiedPayment } from "@/lib/payments/service";

async function main() {
  const suffix = Date.now().toString(36);
  const user = await prisma.client.user.create({ data: { email: `payment-test-${suffix}@example.test`, name: "Payment Test User" } });
  const service = await prisma.client.service.create({
    data: { slug: `payment-test-${suffix}`, title: "Payment Test Service", category: "Test", shortDescription: "Synthetic payment verification service", status: "PUBLISHED" },
  });

  try {
    assertAmountMinor(10050);
    if (majorToMinor("100.50") !== 10050 || minorToMajorString(10050) !== "100.50") throw new Error("Money conversion failed.");

    const base = {
      userId: user.id,
      target: { purpose: PaymentPurpose.SERVICE, serviceId: service.id },
      amountMinor: 10050,
      currency: "INR",
      provider: "mock",
      idempotencyKey: `test-${suffix}`,
      description: "Synthetic payment",
    } as const;

    const first = await createPaymentTransaction(base);
    const second = await createPaymentTransaction(base);
    if (!first.created || second.created || first.transaction.reference !== second.transaction.reference) throw new Error("Idempotency failed.");

    const payment = await getPaymentByReference(first.transaction.reference);
    if (!payment || payment.amountMinor !== 10050 || payment.userId !== user.id) throw new Error("Server-authoritative transaction creation failed.");

    if (!listUserPayments) throw new Error("User payment query missing.");
    let rejected = false;
    try { assertPaymentTransition(PaymentStatus.FAILED, PaymentStatus.SUCCESS); } catch { rejected = true; }
    if (!rejected) throw new Error("Invalid payment transition was accepted.");

    const success = await reconcileVerifiedPayment({
      reference: payment.reference,
      providerTransactionId: "mock-txn-1",
      status: PaymentStatus.SUCCESS,
      amountMinor: 10050,
      currency: "INR",
    });
    if (!success.ok || success.transaction.status !== PaymentStatus.SUCCESS) throw new Error("Verified success reconciliation failed.");

    const duplicate = await reconcileVerifiedPayment({
      reference: payment.reference,
      providerTransactionId: "mock-txn-1",
      status: PaymentStatus.SUCCESS,
      amountMinor: 10050,
      currency: "INR",
    });
    if (!duplicate.ok || duplicate.changed) throw new Error("Duplicate webhook/reconciliation was not idempotent.");

    const mismatch = await reconcileVerifiedPayment({
      reference: payment.reference,
      providerTransactionId: "mock-txn-1",
      status: PaymentStatus.SUCCESS,
      amountMinor: 9999,
      currency: "INR",
    });
    if (mismatch.ok || mismatch.reason !== "PAYMENT_MISMATCH") throw new Error("Amount mismatch was accepted.");

    const own = await listUserPayments(user.id);
    if (own.length !== 1 || own[0].reference !== payment.reference) throw new Error("User payment history query failed.");

    console.log("Payment infrastructure verification passed.");
  } finally {
    await prisma.client.paymentTransaction.deleteMany({ where: { userId: user.id } });
    await prisma.client.service.deleteMany({ where: { id: service.id } });
    await prisma.client.user.delete({ where: { id: user.id } });
  }
}

main().catch((error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) console.error(error.code);
  console.error(error);
  process.exitCode = 1;
});