import type { Metadata } from "next";
import Link from "next/link";
import { listPaymentsForAdmin, parseAdminPaymentStatus } from "@/lib/admin/payments";
import { minorToMajorString } from "@/lib/payments/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payments | Bittumama", robots: { index: false, follow: false, nocache: true } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function one(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = one(params.q);
  const status = parseAdminPaymentStatus(one(params.status));
  const provider = one(params.provider);
  const data = await listPaymentsForAdmin({ q, status, provider });
  return (
    <section>
      <p className="type-label text-muted-foreground">Payments</p>
      <h1 className="type-h2 mt-2">Payment transactions</h1>
      <p className="type-body-sm mt-3 text-muted-foreground">Server-authoritative financial records. Payment success can only come from verified provider state.</p>
      <form className="mt-7 grid gap-3 border-y border-border py-5 sm:grid-cols-[1fr_auto_auto_auto]">
        <input name="q" defaultValue={q} placeholder="Reference or provider transaction ID" aria-label="Search payments" className="min-h-11 border border-border bg-background px-3" />
        <select name="status" defaultValue={status ?? ""} aria-label="Filter by status" className="min-h-11 border border-border bg-background px-3">
          <option value="">All statuses</option>
          {["CREATED","PENDING","SUCCESS","FAILED","CANCELLED","EXPIRED"].map((item)=><option key={item}>{item}</option>)}
        </select>
        <input name="provider" defaultValue={provider} placeholder="Provider" aria-label="Filter by provider" className="min-h-11 border border-border bg-background px-3" />
        <button className="min-h-11 border border-primary bg-primary px-4 type-button text-primary-foreground" type="submit">Filter</button>
      </form>
      <div className="mt-6 overflow-x-auto border-y border-border">
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="border-b border-border"><th className="px-3 py-3 type-label">Reference</th><th className="px-3 py-3 type-label">Purpose</th><th className="px-3 py-3 type-label">Amount</th><th className="px-3 py-3 type-label">Status</th><th className="px-3 py-3 type-label">Provider</th><th className="px-3 py-3 type-label">Created</th></tr></thead>
          <tbody>{data.items.map((item)=><tr key={item.id} className="border-b border-border last:border-0"><td className="px-3 py-4"><Link className="underline underline-offset-4" href={"/admin/payments/"+item.id}>{item.reference}</Link></td><td className="px-3 py-4">{item.purpose}</td><td className="px-3 py-4">{item.currency} {minorToMajorString(item.amountMinor)}</td><td className="px-3 py-4">{item.status}</td><td className="px-3 py-4">{item.provider}</td><td className="px-3 py-4">{item.createdAt.toISOString()}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-4 type-caption text-muted-foreground">{data.total} transaction{data.total === 1 ? "" : "s"} found.</p>
    </section>
  );
}