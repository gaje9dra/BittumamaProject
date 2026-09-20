import type { Metadata } from "next";
import { ExpertiseIndex } from "@/components/experts/expertise-index";
import { ExpertDirectory } from "@/components/experts/expert-directory";
import { ExpertsCta } from "@/components/experts/experts-cta";
import { ExpertsHero } from "@/components/experts/experts-hero";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedExpertDisciplines, getPublishedExperts } from "@/lib/experts/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Experts | Bittumama",
  description: "Explore Bittumama experts, disciplines and areas of expertise.",
});

export default async function ExpertsPage() {
  const experts = await getPublishedExperts();
  const disciplines = await getPublishedExpertDisciplines();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ExpertsHero />
      <ExpertiseIndex disciplines={disciplines} />
      <ExpertDirectory experts={experts} disciplines={disciplines} />
      <ExpertsCta />
    </main>
  );
}
