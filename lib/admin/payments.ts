import "server-only";

import { PaymentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminPayment, listAdminPayments, type AdminPaymentOptions } from "@/lib/payments/repository";

export async function listPaymentsForAdmin(options: AdminPaymentOptions = {}) {
  await requireAdmin();
  return listAdminPayments(options);
}

export async function getPaymentForAdmin(id: string) {
  await requireAdmin();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  return getAdminPayment(id);
}

export function parseAdminPaymentStatus(value: string | undefined) {
  if (!value) return undefined;
  return Object.values(PaymentStatus).includes(value as PaymentStatus) ? value as PaymentStatus : undefined;
}