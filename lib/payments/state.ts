import type { PaymentStatus } from "@/generated/prisma/client";

const transitions: Record<PaymentStatus, readonly PaymentStatus[]> = {
  CREATED: ["PENDING", "CANCELLED", "EXPIRED"],
  PENDING: ["SUCCESS", "FAILED", "CANCELLED", "EXPIRED"],
  SUCCESS: [],
  FAILED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus) {
  return transitions[from].includes(to);
}

export function assertPaymentTransition(from: PaymentStatus, to: PaymentStatus) {
  if (!canTransitionPayment(from, to)) {
    throw new Error("INVALID_PAYMENT_TRANSITION");
  }
}