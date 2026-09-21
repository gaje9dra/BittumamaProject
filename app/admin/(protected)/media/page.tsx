import type { Metadata } from "next";
import Link from "next/link";
import { listMedia } from "@/lib/media/repository";
import { MediaUpload } from "@/components/admin/media-upload";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: "ACTIVE" | "ARCHIVED"; page?: string }> }) {
  const query = await searchParams;
  const page = Math.max(Number(query.page) || 1, 1);
  const result = await listMedia({ q: query.q, status: query.status, page });
  const totalPages = Math.max(Math.ceil(result.total / result.pageSize), 1);
  const href = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    params.set("page", String(nextPage));
    return "/admin/media?" + params.toString();
  };
  return <section aria-labelledby="media-title">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="type-label text-muted-foreground">Media</p><h1 id="media-title" className="type-h2 mt-2">Media library</h1><p className="type-body-sm mt-2 text-muted-foreground">Manage content images used by the site.</p></div>
      <MediaUpload />
    </div>
    <form method="get" className="mt-6 grid gap-3 border-y border-border py-4 sm:grid-cols-[1fr_auto_auto]">
      <label className="sr-only" htmlFor="media-q">Search media</label><input id="media-q" name="q" defaultValue={query.q ?? ""} placeholder="Search filename or alt text…" className="border border-border bg-background px-3 py-2.5 text-sm" />
      <select name="status" defaultValue={query.status ?? ""} className="border border-border bg-background px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select>
      <button className="border border-border px-4 py-2.5 text-sm font-medium">Filter</button>
    </form>
    {result.items.length === 0 ? <div className="border-y border-border py-12 text-sm text-muted-foreground">No media found.</div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {result.items.map((item) => <Link key={item.id} href={"/admin/media/" + item.id} className="group border border-border bg-surface p-3 hover:bg-surface-interactive">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted"><img src={item.publicUrl} alt={item.altText || ""} className="h-full w-full object-cover" /></div>
        <div className="mt-3 min-w-0"><p className="truncate text-sm font-medium">{item.originalFilename}</p><p className="mt-1 text-xs text-muted-foreground">{item.mimeType} · {item.width ?? "—"}×{item.height ?? "—"} · {(item.fileSize / 1024 / 1024).toFixed(2)} MB</p><p className="mt-1 text-xs text-muted-foreground">{item.referenced ? "In use · " + item.usageCount + " reference(s)" : "Unreferenced"} · {item.status}</p></div>
      </Link>)}
    </div>}
    <div className="mt-6 flex items-center justify-between text-sm"><span className="text-muted-foreground">Page {page} of {totalPages}</span><div className="flex gap-2">{page > 1 && <Link href={href(page - 1)} className="border border-border px-3 py-2">Previous</Link>}{page < totalPages && <Link href={href(page + 1)} className="border border-border px-3 py-2">Next</Link>}</div></div>
  </section>;
}
