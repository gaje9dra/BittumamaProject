import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isContentDomain, type ContentDomain } from "@/lib/admin/content";
import { requireAdmin } from "@/lib/auth/guards";
import { verifyPreviewToken, PREVIEW_TTL_MINUTES } from "@/lib/admin/preview";
import { getPreviewServiceById } from "@/lib/services/repository";
import { getPreviewResearchById } from "@/lib/research/repository";
import { getPreviewExpertById } from "@/lib/experts/repository";
import { getPreviewArticleById } from "@/lib/articles/repository";
import { getPreviewEventById } from "@/lib/events/repository";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { ResearchDetailPage } from "@/components/research/research-detail-page";
import { ExpertDetailPage } from "@/components/experts/expert-detail-page";
import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { EventDetailPage } from "@/components/events/event-detail-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Draft Preview | Bittumama",
  robots: { index: false, follow: false, noarchive: true, nocache: true },
};

export default async function AdminPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ domain: value, id }, query, admin] = await Promise.all([params, searchParams, requireAdmin()]);
  void admin;
  if (!isContentDomain(value)) notFound();
  const domain = value as ContentDomain;
  const token = query.token ?? "";
  if (!verifyPreviewToken(token, domain, id)) redirect("/admin/content");

  let content: ReactNode = null;
  switch (domain) {
    case "services": {
      const record = await getPreviewServiceById(id);
      if (!record) notFound();
      content = <ServiceDetailPage service={record} />;
      break;
    }
    case "research": {
      const record = await getPreviewResearchById(id);
      if (!record) notFound();
      content = <ResearchDetailPage research={record} />;
      break;
    }
    case "experts": {
      const record = await getPreviewExpertById(id);
      if (!record) notFound();
      content = <ExpertDetailPage expert={record} />;
      break;
    }
    case "articles": {
      const record = await getPreviewArticleById(id);
      if (!record) notFound();
      content = <ArticleDetailPage article={record} />;
      break;
    }
    case "workshops": {
      const record = await getPreviewEventById(id);
      if (!record) notFound();
      content = <EventDetailPage event={record} />;
      break;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em]">Draft Preview</p>
            <p className="mt-1 text-xs text-muted-foreground">Protected preview · expires in about {PREVIEW_TTL_MINUTES} minutes</p>
          </div>
          <Link href={`/admin/content/${domain}/${id}/edit`} className="border border-border px-3 py-2 text-sm font-medium">Back to Editor</Link>
        </div>
      </div>
      {content}
    </main>
  );
}
