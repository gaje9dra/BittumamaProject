import "dotenv/config";

import { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify payments.");
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function assertAmountMinor(value: number) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error("Invalid minor-unit amount.");
}
function majorToMinor(value: string) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) throw new Error("Invalid monetary amount.");
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
function minorToMajorString(value: number) {
  assertAmountMinor(value);
  return (value / 100).toFixed(2);
}
function canTransition(from: string, to: string) {
  const transitions: Record<string, string[]> = {
    CREATED: ["PENDING", "CANCELLED", "EXPIRED"],
    PENDING: ["SUCCESS", "FAILED", "CANCELLED", "EXPIRED"],
    SUCCESS: [], FAILED: [], CANCELLED: [], EXPIRED: [],
  };
  return transitions[from]?.includes(to) ?? false;
}
function reference() {
  return "pay_" + crypto.randomUUID().replaceAll("-", "");
}

async function main() {
  const suffix = Date.now().toString(36);
  const user = await prisma.user.create({ data: { email: `payment-test-${suffix}@example.test`, name: "Payment Test User" } });
  const service = await prisma.service.create({
    data: { slug: `payment-test-${suffix}`, title: "Payment Test Service", category: "Test", shortDescription: "Synthetic payment verification service", status: "PUBLISHED" },
  });

  try {
    assertAmountMinor(10050);
    if (majorToMinor("100.50") !== 10050 || minorToMajorString(10050) !== "100.50") throw new Error("Money conversion failed.");

    const idempotencyKey = `test-${suffix}`;
    const first = await prisma.paymentTransaction.create({
      data: {
        id: `payment-test-${suffix}`,
        reference: reference(),
        idempotencyKey,
        userId: user.id,
        serviceId: service.id,
        purpose: "SERVICE",
        amountMinor: 10050,
        currency: "INR",
        provider: "mock",
        description: "Synthetic payment",
      },
    });

    const existing = await prisma.paymentTransaction.findUnique({ where: { idempotencyKey } });
    if (!existing || existing.reference !== first.reference) throw new Error("Idempotency lookup failed.");

    let duplicateRejected = false;
    try {
      await prisma.paymentTransaction.create({
        data: {
          id: `payment-test-duplicate-${suffix}`,
          reference: reference(),
          idempotencyKey,
          userId: user.id,
          serviceId: service.id,
          purpose: "SERVICE",
          amountMinor: 10050,
          currency: "INR",
          provider: "mock",
        },
      });
    } catch (error) {
      duplicateRejected = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    }
    if (!duplicateRejected) throw new Error("Duplicate checkout was not rejected by the database.");

    const payment = await prisma.paymentTransaction.findUnique({ where: { reference: first.reference } });
    if (!payment || payment.amountMinor !== 10050 || payment.userId !== user.id) throw new Error("Server-authoritative transaction creation failed.");

    if (canTransition("FAILED", "SUCCESS")) throw new Error("Invalid payment transition was accepted.");
    if (!canTransition("PENDING", "SUCCESS")) throw new Error("Valid payment transition was rejected.");

    const success = await prisma.$transaction(async (tx) => {
      const current = await tx.paymentTransaction.findUnique({ where: { id: payment.id } });
      if (!current || current.status !== "CREATED") throw new Error("Unexpected payment state.");
      const pending = await tx.paymentTransaction.update({ where: { id: payment.id }, data: { status: "PENDING" } });
      const updated = await tx.paymentTransaction.update({
        where: { id: pending.id },
        data: { status: "SUCCESS", providerTransactionId: "mock-txn-1", paidAt: new Date() },
      });
      return updated;
    });
    if (success.status !== "SUCCESS") throw new Error("Verified success reconciliation failed.");

    const duplicate = await prisma.paymentTransaction.updateMany({
      where: { id: payment.id, status: "SUCCESS" },
      data: { status: "SUCCESS" },
    });
    if (duplicate.count !== 1) throw new Error("Duplicate reconciliation handling failed.");

    const mismatch = await prisma.paymentTransaction.findUnique({ where: { id: payment.id }, select: { amountMinor: true, currency: true } });
    if (!mismatch || mismatch.amountMinor === 9999 || mismatch.currency !== "INR") {
      throw new Error("Payment amount/currency authority check failed.");
    }

    const own = await prisma.paymentTransaction.findMany({ where: { userId: user.id }, select: { reference: true } });
    if (own.length !== 1 || own[0].reference !== payment.reference) throw new Error("User payment history query failed.");

    console.log("Payment infrastructure verification passed.");
  } finally {
    await prisma.paymentTransaction.deleteMany({ where: { userId: user.id } });
    await prisma.service.deleteMany({ where: { id: service.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exitCode = 1;
});
