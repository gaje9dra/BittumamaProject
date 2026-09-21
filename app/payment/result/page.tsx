import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guards";
import { getPaymentByReference } from "@/lib/payments/repository";
import { minorToMajorString } from "@/lib/payments/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment result | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function PaymentResultPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const user = await getCurrentUser();
  if (!user) return <main className="mx-auto max-w-3xl px-[var(--page-gutter)] py-16"><h1 className="type-h2">Sign in to view this payment.</h1><Link className="mt-5 inline-block underline underline-offset-4" href="/login">Sign in</Link></main>;

  const { reference } = await searchParams;
  const safeReference = reference?.trim() ?? "";
  const payment = /^pay_[A-Za-z0-9]{20,64}$/.test(safeReference) ? await getPaymentByReference(safeReference) : null;
  if (!payment || payment.userId !== user.id) {
    return <main className="mx-auto max-w-3xl px-[var(--page-gutter)] py-16"><h1 className="type-h2">Payment not found.</h1><p className="mt-3 type-body-sm text-muted-foreground">The payment reference is invalid or does not belong to this account.</p></main>;
  }

  const message = payment.status === "SUCCESS" ? "Payment successful" : payment.status === "PENDING" || payment.status === "CREATED" ? "Payment is being confirmed" : payment.status === "FAILED" ? "Payment failed" : payment.status === "CANCELLED" ? "Payment cancelled" : "Payment expired";
  return (
    <main className="mx-auto max-w-3xl px-[var(--page-gutter)] py-12 sm:py-16">
      <p className="type-label text-muted-foreground">Payment result</p>
      <h1 className="type-h2 mt-2">{message}</h1>
      <dl className="mt-7 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="type-label text-muted-foreground">Reference</dt><dd className="mt-1 type-body-sm">{payment.reference}</dd></div>
        <div><dt className="type-label text-muted-foreground">Amount</dt><dd className="mt-1 type-body-sm">{payment.currency} {minorToMajorString(payment.amountMinor)}</dd></div>
        <div><dt className="type-label text-muted-foreground">Purpose</dt><dd className="mt-1 type-body-sm">{payment.purpose}</dd></div>
        <div><dt className="type-label text-muted-foreground">Status</dt><dd className="mt-1 type-body-sm">{payment.status}</dd></div>
      </dl>
    </main>
  );
}