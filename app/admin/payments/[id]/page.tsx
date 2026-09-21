import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPaymentForAdmin } from "@/lib/admin/payments";
import { minorToMajorString } from "@/lib/payments/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment detail | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AdminPaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await getPaymentForAdmin(id);
  if (!payment) notFound();
  return (
    <section>
      <p className="type-label text-muted-foreground">Payment</p>
      <h1 className="type-h2 mt-2">{payment.reference}</h1>
      <dl className="mt-7 grid gap-5 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Status", payment.status],
          ["Purpose", payment.purpose],
          ["Amount", payment.currency+" "+minorToMajorString(payment.amountMinor)],
          ["Provider", payment.provider],
          ["Provider transaction", payment.providerTransactionId ?? "—"],
          ["User", payment.user?.email ?? payment.userId ?? "—"],
          ["Event", payment.event?.title ?? "—"],
          ["Service", payment.service?.title ?? "—"],
          ["Registration", payment.registrationId ?? "—"],
          ["Created", payment.createdAt.toISOString()],
          ["Paid", payment.paidAt?.toISOString() ?? "—"],
          ["Failure", payment.failureMessage ?? payment.failureCode ?? "—"],
        ].map(([label,value])=><div key={label}><dt className="type-label text-muted-foreground">{label}</dt><dd className="mt-1 type-body-sm break-words">{value}</dd></div>)}
      </dl>
      <p className="mt-6 type-caption text-muted-foreground">Payment records cannot be manually marked successful or deleted from this interface.</p>
    </section>
  );
}