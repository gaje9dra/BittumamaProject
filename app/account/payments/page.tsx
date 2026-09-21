import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOwnPaymentHistory } from "@/lib/user/payments";
import { minorToMajorString } from "@/lib/payments/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment history | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function PaymentHistoryPage() {
  const paymentHistory = await getOwnPaymentHistory();
  if (!paymentHistory) redirect("/login?callbackUrl=%2Faccount%2Fpayments");
  const payments = paymentHistory.items;
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-[var(--page-gutter)] py-12 sm:py-16">
        <p className="type-label text-muted-foreground">Account</p>
        <h1 className="type-h2 mt-2">Payment history</h1>
        <div className="mt-7 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[620px] text-left">
            <thead><tr className="border-b border-border"><th className="px-3 py-3 type-label">Reference</th><th className="px-3 py-3 type-label">Purpose</th><th className="px-3 py-3 type-label">Amount</th><th className="px-3 py-3 type-label">Status</th><th className="px-3 py-3 type-label">Created</th></tr></thead>
            <tbody>{payments.map((item)=><tr key={item.reference} className="border-b border-border last:border-0"><td className="px-3 py-4">{item.reference}</td><td className="px-3 py-4">{item.purpose}</td><td className="px-3 py-4">{item.currency} {minorToMajorString(item.amountMinor)}</td><td className="px-3 py-4">{item.status}</td><td className="px-3 py-4">{item.createdAt.toISOString()}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}