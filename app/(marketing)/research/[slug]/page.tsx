import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetailPage } from "@/components/research/research-detail-page";
import { getResearchHref } from "@/lib/research/paths";
import { getPublishedResearchBySlug } from "@/lib/research/repository";
import { createContentMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type ResearchDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ResearchDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const research = await getPublishedResearchBySlug(slug);
  if (!research) return { title: "Research not found | Bittumama" };

  return createContentMetadata({
    seo: research.seo,
    title: research.title,
    description: research.shortDescription,
    image: research.image,
    canonical: getResearchHref(research),
  });
}

export default async function ResearchDetailRoute({ params }: ResearchDetailRouteProps) {
  const { slug } = await params;
  const research = await getPublishedResearchBySlug(slug);
  if (!research) notFound();

  return <ResearchDetailPage research={research} />;
}
