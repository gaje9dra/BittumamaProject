import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertDetailPage } from "@/components/experts/expert-detail-page";
import { experts, getExpertBySlug } from "@/data/expertise";

type ExpertDetailRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experts.map((expert) => ({ slug: expert.slug }));
}

export async function generateMetadata({ params }: ExpertDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);
  if (!expert) return { title: "Expert not found | Bittumama" };
  return {
    title: expert.seo?.title ?? expert.name + " | Experts | Bittumama",
    description: expert.seo?.description ?? expert.shortBio,
    alternates: { canonical: "/experts/" + expert.slug },
  };
}

export default async function ExpertDetailRoute({ params }: ExpertDetailRouteProps) {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);
  if (!expert) notFound();
  return <ExpertDetailPage expert={expert} />;
}
