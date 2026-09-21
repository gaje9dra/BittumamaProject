import "server-only";

import type { PaymentProviderAdapter } from "@/lib/payments/types";

const providers = new Map<string, PaymentProviderAdapter>();

export function registerPaymentProvider(adapter: PaymentProviderAdapter) {
  if (!adapter.name.trim()) throw new Error("Payment provider name is required.");
  providers.set(adapter.name, adapter);
}

export function getConfiguredPaymentProvider(): PaymentProviderAdapter {
  const name = process.env.PAYMENT_PROVIDER?.trim();
  if (!name) throw new Error("PAYMENT_PROVIDER is not configured.");
  const provider = providers.get(name);
  if (!provider) throw new Error(`Payment provider "${name}" is not registered.`);
  return provider;
}

export function getConfiguredPaymentProviderName() {
  return process.env.PAYMENT_PROVIDER?.trim() || null;
}