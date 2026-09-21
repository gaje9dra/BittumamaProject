import type { Metadata } from "next";
import Link from "next/link";
import { getInquiryServices, getInquirySummary, listInquiries } from "@/lib/admin/inquiries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Inquiries | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

type SearchParams = Promise<{
  q?: string;
  status?: "NEW" | "READ" | "IN_PROGRESS" | "RESOLVED" | "SPAM";
  serviceId?: string;
  from?: string;
  to?: string;
  page?: string;
  sort?: "newest" | "oldest" | "updated";
}>;

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const query = search.toString();
  return query ? `/admin/inquiries?${query}` : "/admin/inquiries";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

const statusLabels = { NEW: "New", READ: "Read", IN_PROGRESS: "In progress", RESOLVED: "Resolved", SPAM: "Spam" };

export default async function AdminInquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const [result, summary, services] = await Promise.all([
    listInquiries({ q: params.q, status: params.status, serviceId: params.serviceId, from: params.from, to: params.to, page, sort: params.sort }),
    getInquirySummary(),
    getInquiryServices(),
  ]);
  const totalPages = Math.max(Math.ceil(result.total / result.pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const commonParams = { q: params.q, status: params.status, serviceId: params.serviceId, from: params.from, to: params.to, sort: params.sort };
  const previous = buildHref({ ...commonParams, page: safePage > 1 ? String(safePage - 1) : undefined });
  const next = buildHref({ ...commonParams, page: safePage < totalPages ? String(safePage + 1) : undefined });

  return (
    <section aria-labelledby="inquiries-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-label text-muted-foreground">Operations</p>
          <h1 id="inquiries-title" className="type-h2 mt-2">Inquiries</h1>
          <p className="type-body-sm mt-3 text-muted-foreground">Review and process incoming Contact inquiries.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="border border-border bg-surface px-3 py-2"><strong>{summary.newCount}</strong> New</span>
          <span className="border border-border bg-surface px-3 py-2"><strong>{summary.inProgressCount}</strong> In progress</span>
          <span className="border border-border bg-surface px-3 py-2"><strong>{summary.resolvedCount}</strong> Resolved</span>
        </div>
      </div>

      <form method="get" className="mt-6 grid gap-3 border-y border-border py-4 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_auto_auto_auto_auto_auto]">
        <div>
          <label htmlFor="inquiry-search" className="sr-only">Search inquiries</label>
          <input id="inquiry-search" name="q" defaultValue={params.q ?? ""} placeholder="Search name, email, service or message…" className="min-h-10 w-full border border-border bg-background px-3 py-2.5 text-sm" />
        </div>
        <select name="status" defaultValue={params.status ?? ""} aria-label="Filter by status" className="min-h-10 border border-border bg-background px-3 py-2.5 text-sm">
          <option value="">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select name="serviceId" defaultValue={params.serviceId ?? ""} aria-label="Filter by service" className="min-h-10 border border-border bg-background px-3 py-2.5 text-sm">
          <option value="">All services</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}{service.status !== "PUBLISHED" ? " (archived/unpublished)" : ""}</option>)}
        </select>
        <input type="date" name="from" defaultValue={params.from ?? ""} aria-label="From date" className="min-h-10 border border-border bg-background px-3 py-2.5 text-sm" />
        <input type="date" name="to" defaultValue={params.to ?? ""} aria-label="To date" className="min-h-10 border border-border bg-background px-3 py-2.5 text-sm" />
        <button className="min-h-10 border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-interactive">Search</button>
      </form>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">{result.total} {result.total === 1 ? "inquiry" : "inquiries"}</p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort</span>
          <Link href={buildHref({ ...commonParams, sort: "newest" })} className="underline underline-offset-4">Newest</Link>
          <Link href={buildHref({ ...commonParams, sort: "oldest" })} className="underline underline-offset-4">Oldest</Link>
          <Link href={buildHref({ ...commonParams, sort: "updated" })} className="underline underline-offset-4">Updated</Link>
        </div>
      </div>

      {result.items.length === 0 ? (
        <div className="mt-6 border-y border-border py-12 text-sm text-muted-foreground">
          {params.q || params.status || params.serviceId || params.from || params.to ? "No inquiries match your search." : "No inquiries yet."}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-3 py-3 font-medium">Status</th>
              <th scope="col" className="px-3 py-3 font-medium">Name</th>
              <th scope="col" className="px-3 py-3 font-medium">Email</th>
              <th scope="col" className="px-3 py-3 font-medium">Service</th>
              <th scope="col" className="px-3 py-3 font-medium">Submitted</th>
              <th scope="col" className="px-3 py-3 font-medium">Updated</th>
              <th scope="col" className="px-3 py-3 font-medium"><span className="sr-only">Action</span></th>
            </tr></thead>
            <tbody>
              {result.items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface-interactive">
                  <td className="px-3 py-4"><span className="inline-flex items-center border border-border px-2 py-1 text-xs font-medium">{statusLabels[item.status]}</span></td>
                  <td className="px-3 py-4 font-medium">{item.name}</td>
                  <td className="px-3 py-4"><a href={`mailto:${item.email}`} className="underline underline-offset-4">{item.email}</a></td>
                  <td className="px-3 py-4">{item.service?.title ?? "—"}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-muted-foreground">{formatDate(item.submittedAt)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-muted-foreground">{formatDate(item.updatedAt)}</td>
                  <td className="px-3 py-4 text-right"><Link href={`/admin/inquiries/${item.id}`} className="font-medium underline underline-offset-4">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Page {safePage} of {totalPages}</span>
        <div className="flex gap-2">
          {safePage > 1 && <Link href={previous} className="border border-border px-3 py-2">Previous</Link>}
          {safePage < totalPages && <Link href={next} className="border border-border px-3 py-2">Next</Link>}
        </div>
      </div>
    </section>
  );
}
