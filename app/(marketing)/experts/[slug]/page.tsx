import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertDetailPage } from "@/components/experts/expert-detail-page";
import { getAllExperts, getExpertBySlug, getExpertHref } from "@/data/expertise";
import { createContentMetadata } from "@/lib/metadata";

type ExpertDetailRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllExperts().map((expert) => ({ slug: expert.slug }));
}

export async function generateMetadata({ params }: ExpertDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);
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
  const expert = getExpertBySlug(slug);
  if (!expert) notFound();
  return <ExpertDetailPage expert={expert} />;
}
