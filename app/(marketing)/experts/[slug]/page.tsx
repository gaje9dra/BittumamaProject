import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertDetailPage } from "@/components/experts/expert-detail-page";
import { getExpertHref } from "@/lib/experts/paths";
import { getPublishedExpertBySlug } from "@/lib/experts/repository";
import { createContentMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type ExpertDetailRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ExpertDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = await getPublishedExpertBySlug(slug);
  if (!expert) return { title: "Expert not found | Bittumama" };

  return createContentMetadata({
    seo: expert.seo,
    title: expert.name,
    description: expert.shortBio,
    image: expert.image,
    canonical: getExpertHref(expert),
  });
}

export default async function ExpertDetailRoute({ params }: ExpertDetailRouteProps) {
  const { slug } = await params;
  const expert = await getPublishedExpertBySlug(slug);
  if (!expert) notFound();

  return <ExpertDetailPage expert={expert} />;
}
