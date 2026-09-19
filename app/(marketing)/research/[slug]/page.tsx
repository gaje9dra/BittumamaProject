import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetailPage } from "@/components/research/research-detail-page";
import { getAllResearch, getResearchBySlug, getResearchHref } from "@/data/research";

type ResearchDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllResearch().map((research) => ({ slug: research.slug }));
}

export async function generateMetadata({ params }: ResearchDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const research = getResearchBySlug(slug);
  if (!research) return { title: "Research not found | Bittumama" };
  return {
    title: research.title + " | Research | Bittumama",
    description: research.shortDescription,
    alternates: {
      canonical: getResearchHref(research),
    },
  };
}

export default async function ResearchDetailRoute({ params }: ResearchDetailRouteProps) {
  const { slug } = await params;
  const research = getResearchBySlug(slug);
  if (!research) notFound();
  return <ResearchDetailPage research={research} />;
}
