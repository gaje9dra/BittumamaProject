import type { PaymentPurpose, PaymentStatus } from "@/generated/prisma/client";

export type PaymentProvider = string;

export type PaymentTarget = {
  purpose: PaymentPurpose;
  serviceId?: string;
  eventId?: string;
  registrationId?: string;
};

export type ResolvedPaymentTarget = PaymentTarget & {
  amountMinor: number;
  currency: string;
  description: string;
  userId: string;
};

export type VerifiedPayment = {
  reference: string;
  providerTransactionId: string | null;
  status: PaymentStatus;
  amountMinor: number;
  currency: string;
  failureCode?: string | null;
  failureMessage?: string | null;
};

export type CheckoutRequest = {
  reference: string;
  amountMinor: number;
  currency: string;
  description: string;
  customer: { name: string; email: string };
  returnUrl: string;
};

export type CheckoutResponse = {
  checkoutUrl: string;
  providerTransactionId?: string | null;
};

export type PaymentProviderAdapter = {
  name: PaymentProvider;
  createCheckout(request: CheckoutRequest): Promise<CheckoutResponse>;
  verifyReturn(input: Record<string, string>): Promise<VerifiedPayment>;
  verifyWebhook(input: Record<string, string>): Promise<VerifiedPayment>;
  reconcile(reference: string): Promise<VerifiedPayment>;
};