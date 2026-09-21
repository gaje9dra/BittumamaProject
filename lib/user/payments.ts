import "server-only";

import { getCurrentUser } from "@/lib/auth/guards";
import { listUserPayments } from "@/lib/payments/repository";

export async function getOwnPaymentHistory() {
  const user = await getCurrentUser();
  if (!user) return null;
  return listUserPayments(user.id);
}