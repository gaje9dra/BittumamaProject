import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { getPaymentByReference } from "@/lib/payments/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const reference = new URL(request.url).searchParams.get("reference")?.trim() ?? "";
  if (!/^pay_[A-Za-z0-9]{20,64}$/.test(reference)) return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  const payment = await getPaymentByReference(reference);
  if (!payment || payment.userId !== user.id) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  return NextResponse.json({
    reference: payment.reference, amountMinor: payment.amountMinor, currency: payment.currency,
    purpose: payment.purpose, status: payment.status, createdAt: payment.createdAt, paidAt: payment.paidAt,
  });
}