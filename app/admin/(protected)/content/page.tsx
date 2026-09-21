import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT_DOMAINS, CONTENT_LABELS, getContentOverview } from "@/lib/admin/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AdminContentPage() {
  const overview = await getContentOverview();
  return (
    <section aria-labelledby="content-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="type-label text-muted-foreground">Content</p><h1 id="content-title" className="type-h2 mt-2">Content management</h1><p className="type-body-sm mt-3 text-muted-foreground">Manage the five canonical public content domains.</p></div>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {CONTENT_DOMAINS.map((domain) => { const item = overview[domain]; return (
          <Link key={domain} href={`/admin/content/${domain}`} className="border border-border bg-surface p-5 transition-colors hover:bg-surface-interactive">
            <p className="type-caption text-muted-foreground">{CONTENT_LABELS[domain]}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{item.total}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.published} published · {item.draft} draft · {item.archived} archived</p>
          </Link>
        );})}
      </div>
    </section>
  );
}
