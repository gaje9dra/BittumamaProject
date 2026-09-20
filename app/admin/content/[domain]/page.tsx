import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTENT_LABELS, contentBasePath, isContentDomain, listContent, type ContentDomain } from "@/lib/admin/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content area | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AdminContentListPage({ params, searchParams }: { params: Promise<{ domain: string }>; searchParams: Promise<{ q?: string; status?: string; page?: string; sort?: string }> }) {
  const { domain: value } = await params;
  if (!isContentDomain(value)) notFound();
  const domain = value as ContentDomain;
  const query = await searchParams;
  const page = Math.max(Number(query.page) || 1, 1);
  const result = await listContent(domain, { q: query.q, status: query.status, page, sort: query.sort });
  const totalPages = Math.max(Math.ceil(result.total / result.pageSize), 1);
  const base = contentBasePath(domain);
  const titleKey = domain === "experts" ? "name" : "title";
  const pageUrl = (nextPage:number) => { const p = new URLSearchParams(); if(query.q)p.set("q",query.q); if(query.status)p.set("status",query.status); if(query.sort)p.set("sort",query.sort); p.set("page",String(nextPage)); return `${base}?${p.toString()}`; };

  return (
    <section aria-labelledby="content-list-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="type-label text-muted-foreground">Content / {CONTENT_LABELS[domain]}</p><h1 id="content-list-title" className="type-h2 mt-2">{CONTENT_LABELS[domain]}</h1><p className="type-body-sm mt-2 text-muted-foreground">{result.total} record{result.total===1?"":"s"}</p></div>
        <Link href={`${base}/new`} className="bg-foreground px-4 py-2.5 text-sm font-medium text-background">New {domain === "experts" ? "Expert" : domain === "workshops" ? "Workshop / Event" : CONTENT_LABELS[domain].replace(/s$/,"")}</Link>
      </div>
      <form method="get" className="mt-6 grid gap-3 border-y border-border py-4 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="sr-only" htmlFor="q">Search</label><input id="q" name="q" defaultValue={query.q ?? ""} placeholder={`Search ${titleKey === "name" ? "name" : "title"} or slug…`} className="border border-border bg-background px-3 py-2.5 text-sm"/>
        <select name="status" defaultValue={query.status ?? ""} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select>
        <select name="sort" defaultValue={query.sort ?? ""} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">Recently updated</option><option value="title">Title</option><option value="date">Date</option></select>
        <button className="border border-border px-4 py-2.5 text-sm font-medium">Filter</button>
      </form>
      {result.items.length === 0 ? <div className="border-y border-border py-10 text-sm text-muted-foreground">No {CONTENT_LABELS[domain].toLowerCase()} found.</div> : (
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-surface"><tr><th className="px-4 py-3 font-medium">{titleKey === "name" ? "Name" : "Title"}</th><th className="px-4 py-3 font-medium">Slug</th><th className="px-4 py-3 font-medium">Type / Category</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Updated</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
            <tbody className="divide-y divide-border">
              {result.items.map((item:any) => <tr key={item.id}><td className="px-4 py-3 font-medium">{item.title ?? item.name}</td><td className="px-4 py-3 text-muted-foreground">{item.slug}</td><td className="px-4 py-3 text-muted-foreground">{item.category ?? item.discipline ?? "—"}</td><td className="px-4 py-3"><span className="border border-border px-2 py-1 text-xs">{item.status}</span></td><td className="px-4 py-3 text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</td><td className="px-4 py-3"><Link href={`${base}/${item.id}/edit`} className="underline underline-offset-4">Edit</Link></td></tr>)}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-2">{page > 1 && <Link href={pageUrl(page-1)} className="border border-border px-3 py-2">Previous</Link>}{page < totalPages && <Link href={pageUrl(page+1)} className="border border-border px-3 py-2">Next</Link>}</div>
      </div>
    </section>
  );
}
