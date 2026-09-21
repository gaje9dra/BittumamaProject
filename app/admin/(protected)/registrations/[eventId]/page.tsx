import type { Metadata } from "next";
import Link from "next/link";
import { getAdminEventRegistrationSummary, listEventRegistrations } from "@/lib/admin/registrations";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Event registrations | Bittumama", robots: { index: false, follow: false, noarchive: true, nocache: true } };

const statusOptions = ["", "PENDING", "CONFIRMED", "CANCELLED", "REJECTED"];

export default async function EventRegistrationsPage({ params, searchParams }: { params: Promise<{ eventId: string }>; searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  await requireAdmin();
  const { eventId } = await params;
  const query = await searchParams;
  const summary = await getAdminEventRegistrationSummary(eventId);
  if (!summary) return <section><h1 className="type-h2">Event not found</h1></section>;
  const result = await listEventRegistrations(eventId, { q: query.q, status: query.status, page: Number(query.page) || 1 });

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="type-label text-muted-foreground">Registrations</p><h1 className="type-h2 mt-2">{summary.title}</h1><p className="type-body-sm mt-2 text-muted-foreground">{summary.count} active registration{summary.count === 1 ? "" : "s"}{summary.remaining != null ? ` · ${summary.remaining} remaining` : ""}</p></div>
        <Link href={`/admin/content/workshops/${eventId}/edit`} className="border border-border px-4 py-2.5 text-sm">Back to event</Link>
      </div>

      <form className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <input name="q" defaultValue={query.q ?? ""} placeholder="Search name, email or organization" className="min-h-10 border border-border bg-background px-3 py-2 text-sm" />
        <select name="status" defaultValue={query.status ?? ""} className="min-h-10 border border-border bg-background px-3 py-2 text-sm">
          {statusOptions.map((status) => <option key={status} value={status}>{status || "All statuses"}</option>)}
        </select>
        <button className="min-h-10 border border-border px-4 py-2 text-sm font-medium">Filter</button>
      </form>

      <div className="mt-8 overflow-x-auto border-y border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground"><th className="px-3 py-3">Registrant</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Created</th><th className="px-3 py-3">Details</th></tr></thead>
          <tbody>
            {result.items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-3 py-4"><span className="font-medium">{item.fullName}</span>{item.organization && <span className="block text-xs text-muted-foreground">{item.organization}</span>}</td>
                <td className="px-3 py-4">{item.email}</td>
                <td className="px-3 py-4">{item.status}</td>
                <td className="px-3 py-4">{item.createdAt.toLocaleString("en-IN")}</td>
                <td className="px-3 py-4"><Link className="underline underline-offset-4" href={`/admin/registrations/${eventId}/${item.id}`}>View</Link></td>
              </tr>
            ))}
            {!result.items.length && <tr><td colSpan={5} className="px-3 py-10 text-center text-muted-foreground">No registrations found.</td></tr>}
          </tbody>
        </table>
      </div>

      {result.total > result.pageSize && (
        <div className="mt-5 flex gap-3 text-sm">
          {result.page > 1 && <Link href={`/admin/registrations/${eventId}?q=${encodeURIComponent(query.q ?? "")}&status=${encodeURIComponent(query.status ?? "")}&page=${result.page - 1}`} className="border border-border px-3 py-2">Previous</Link>}
          {result.page * result.pageSize < result.total && <Link href={`/admin/registrations/${eventId}?q=${encodeURIComponent(query.q ?? "")}&status=${encodeURIComponent(query.status ?? "")}&page=${result.page + 1}`} className="border border-border px-3 py-2">Next</Link>}
        </div>
      )}
    </section>
  );
}
