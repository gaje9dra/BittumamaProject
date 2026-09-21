import type { Metadata } from "next";
import { AnalyticsContentType, AnalyticsEventCategory } from "@/generated/prisma/client";
import { getAdminAnalytics } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics | Bittumama", robots: { index: false, follow: false, nocache: true, noarchive: true } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
function one(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

function TrendTable({ title, rows }: { title: string; rows: Array<{ day: string; count: number }> }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return <section className="border-y border-border"><div className="border-b border-border px-3 py-4"><h2 className="type-h5">{title}</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead><tr className="border-b border-border"><th className="px-3 py-3 type-label">Date</th><th className="px-3 py-3 type-label">Count</th><th className="px-3 py-3 type-label">Relative</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.day} className="border-b border-border last:border-0"><td className="px-3 py-3 type-body-sm">{row.day}</td><td className="px-3 py-3 type-body-sm">{row.count}</td><td className="px-3 py-3"><div className="h-2 min-w-20 bg-surface-interactive" role="img" aria-label={row.count + " events"}><div className="h-2 bg-primary" style={{ width: (row.count / max * 100) + "%" }} /></div></td></tr>) : <tr><td colSpan={3} className="px-3 py-6 type-body-sm text-muted-foreground">No events in this range.</td></tr>}</tbody></table></div></section>;
}

export default async function AdminAnalyticsPage({ searchParams }: Props) {
  const params = await searchParams;
  const range = one(params.range) ?? "30d";
  const start = one(params.start);
  const end = one(params.end);
  const category = one(params.category);
  const contentType = one(params.contentType);
  const result = await getAdminAnalytics({ range, start, end, category, contentType });
  const data = result.data;
  const cards = [["Views", data.totalViews], ["Inquiries", data.inquiries], ["Registrations", data.registrations], ["Payment attempts", data.paymentAttempts], ["Payment success", data.paymentSuccess], ["Payment failed", data.paymentFailed]];

  return <section><p className="type-label text-muted-foreground">Analytics</p><h1 className="type-h2 mt-2">Product measurement</h1><p className="type-body-sm mt-3 max-w-2xl text-muted-foreground">First-party aggregate measurement. Views exclude admin, preview and unpublished traffic. Reporting dates use UTC.</p>
    <form className="mt-7 grid gap-3 border-y border-border py-5 md:grid-cols-4" method="get">
      <label className="grid gap-1 type-label">Range<select name="range" defaultValue={range} className="min-h-11 border border-border bg-background px-3"><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="custom">Custom</option></select></label>
      <label className="grid gap-1 type-label">Category<select name="category" defaultValue={category ?? ""} className="min-h-11 border border-border bg-background px-3"><option value="">All</option>{Object.values(AnalyticsEventCategory).map((item)=><option key={item}>{item}</option>)}</select></label>
      <label className="grid gap-1 type-label">Content type<select name="contentType" defaultValue={contentType ?? ""} className="min-h-11 border border-border bg-background px-3"><option value="">All</option>{Object.values(AnalyticsContentType).map((item)=><option key={item}>{item}</option>)}</select></label>
      <button type="submit" className="min-h-11 self-end border border-primary bg-primary px-4 type-button text-primary-foreground">Apply filters</button>
      <div className="md:col-span-4 grid gap-3 sm:grid-cols-2"><label className="grid gap-1 type-label">Custom start<input type="date" name="start" defaultValue={start} className="min-h-11 border border-border bg-background px-3" /></label><label className="grid gap-1 type-label">Custom end<input type="date" name="end" defaultValue={end} className="min-h-11 border border-border bg-background px-3" /></label></div>
    </form>
    <p className="mt-4 type-caption text-muted-foreground">Selected window is bounded to 366 days. Unique visitors are not shown because this phase does not implement identity stitching.</p>
    <div className="mt-7 grid gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value])=><div key={String(label)}><p className="type-label text-muted-foreground">{label}</p><p className="mt-1 type-h4">{value}</p></div>)}</div>
    <div className="mt-8 grid gap-8 lg:grid-cols-2"><TrendTable title="Views over time" rows={data.viewsTrend}/><TrendTable title="Conversions over time" rows={data.conversionsTrend}/></div>
    <section className="mt-8 border-y border-border"><div className="border-b border-border px-3 py-4"><h2 className="type-h5">Top viewed content</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-border"><th className="px-3 py-3 type-label">Type</th><th className="px-3 py-3 type-label">Content</th><th className="px-3 py-3 type-label">Views</th></tr></thead><tbody>{data.topContent.length ? data.topContent.map((item)=><tr key={item.contentType+item.contentId} className="border-b border-border last:border-0"><td className="px-3 py-3 type-body-sm">{item.contentType}</td><td className="px-3 py-3 type-body-sm">{item.title}</td><td className="px-3 py-3 type-body-sm">{item.views}</td></tr>) : <tr><td colSpan={3} className="px-3 py-6 type-body-sm text-muted-foreground">No content views in this range.</td></tr>}</tbody></table></div></section>
    <p className="mt-6 type-caption text-muted-foreground">Revenue remains authoritative in PaymentTransaction; analytics events measure conversion context only.</p>
  </section>;
}
