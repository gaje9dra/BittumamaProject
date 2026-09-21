import type { Metadata } from "next";
import Link from "next/link";
import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { getAuditLogs, parseAuditQuery } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Audit logs | Bittumama", robots: { index: false, follow: false, nocache: true } };

function selectOptions(values: readonly string[]) { return values.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>); }

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const input: Record<string, string | undefined> = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const query = parseAuditQuery(input);
  const data = await getAuditLogs(query);
  const base = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) if (value) base.set(key, value);
  const linkForPage = (page: number) => { const p = new URLSearchParams(base); p.set("page", String(page)); return "?" + p.toString(); };

  return <section aria-labelledby="audit-title">
    <div className="max-w-3xl"><p className="type-label text-muted-foreground">Administration</p><h1 id="audit-title" className="type-h2 mt-2">Audit logs</h1><p className="type-body-sm mt-3 text-muted-foreground">Administrative and security-relevant history. Entries are append-only in the application.</p></div>
    <form className="mt-8 grid gap-3 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4" method="get">
      <label className="type-caption">Search<input name="search" defaultValue={input.search} placeholder="ID, request, summary" className="mt-1 min-h-10 w-full border border-input bg-background px-3" /></label>
      <label className="type-caption">Action<select name="action" defaultValue={input.action ?? ""} className="mt-1 min-h-10 w-full border border-input bg-background px-3"><option value="">All actions</option>{selectOptions(Object.values(AuditAction))}</select></label>
      <label className="type-caption">Category<select name="category" defaultValue={input.category ?? ""} className="mt-1 min-h-10 w-full border border-input bg-background px-3"><option value="">All categories</option>{selectOptions(Object.values(AuditCategory))}</select></label>
      <label className="type-caption">Result<select name="result" defaultValue={input.result ?? ""} className="mt-1 min-h-10 w-full border border-input bg-background px-3"><option value="">All results</option>{selectOptions(Object.values(AuditResult))}</select></label>
      <label className="type-caption">Severity<select name="severity" defaultValue={input.severity ?? ""} className="mt-1 min-h-10 w-full border border-input bg-background px-3"><option value="">All severities</option>{selectOptions(Object.values(AuditSeverity))}</select></label>
      <label className="type-caption">Entity type<input name="entityType" defaultValue={input.entityType} className="mt-1 min-h-10 w-full border border-input bg-background px-3" /></label>
      <label className="type-caption">Entity ID<input name="entityId" defaultValue={input.entityId} className="mt-1 min-h-10 w-full border border-input bg-background px-3" /></label>
      <label className="type-caption">Page size<select name="pageSize" defaultValue={String(query.pageSize)} className="mt-1 min-h-10 w-full border border-input bg-background px-3"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label>
      <div className="sm:col-span-2 lg:col-span-4"><button type="submit" className="min-h-10 border border-primary bg-primary px-4 type-button text-primary-foreground">Filter</button>{" "}<Link href="/admin/audit-logs" className="inline-flex min-h-10 items-center border border-border px-4 type-button">Reset</Link></div>
    </form>
    <div className="mt-6 overflow-x-auto border border-border"><table className="w-full min-w-[900px] border-collapse text-left"><caption className="sr-only">Administrative audit history</caption><thead><tr className="border-b border-border bg-surface text-muted-foreground">{["Timestamp","Actor","Action","Category","Entity","Result","Severity","Summary"].map((h)=><th key={h} scope="col" className="px-3 py-3 type-caption">{h}</th>)}</tr></thead><tbody>{data.rows.map((row)=><tr key={row.id} className="border-b border-border align-top"><td className="px-3 py-3 whitespace-nowrap text-sm">{row.createdAt.toISOString()}</td><td className="px-3 py-3 text-sm">{row.actorUser?.name || row.actorUser?.email || "System"}</td><td className="px-3 py-3 text-sm"><Link href={"/admin/audit-logs/"+row.id} className="underline underline-offset-4">{row.action}</Link></td><td className="px-3 py-3 text-sm">{row.category}</td><td className="px-3 py-3 text-sm">{row.entityType ? row.entityType + (row.entityId ? ":" + row.entityId : "") : "—"}</td><td className="px-3 py-3 text-sm">{row.result}</td><td className="px-3 py-3 text-sm">{row.severity}</td><td className="px-3 py-3 max-w-sm text-sm">{row.summary}</td></tr>)}</tbody></table>{data.rows.length === 0 && <p className="p-6 type-body-sm text-muted-foreground">No audit entries match these filters.</p>}</div>
    <nav aria-label="Audit log pagination" className="mt-5 flex items-center justify-between type-body-sm"><span>Page {query.page} of {data.totalPages} · {data.total} entries</span><span className="flex gap-3">{query.page > 1 ? <Link href={linkForPage(query.page-1)} className="underline underline-offset-4">Previous</Link> : <span className="text-muted-foreground">Previous</span>}{query.page < data.totalPages ? <Link href={linkForPage(query.page+1)} className="underline underline-offset-4">Next</Link> : <span className="text-muted-foreground">Next</span>}</span></nav>
  </section>;
}
