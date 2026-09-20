import type { Metadata } from "next";
import { ResearchCategoryIndex } from "@/components/research/research-category-index";
import { ResearchCta } from "@/components/research/research-cta";
import { ResearchDirectory } from "@/components/research/research-directory";
import { ResearchFeatured } from "@/components/research/research-featured";
import { ResearchHero } from "@/components/research/research-hero";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedResearch } from "@/lib/research/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Research | Bittumama",
  description: "Research, analysis, studies and knowledge resources from Bittumama.",
});

export default async function ResearchPage() {
  const entries = await getPublishedResearch();
  const categories = Array.from(new Set(entries.map((entry) => entry.category)));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResearchHero />
      <ResearchCategoryIndex categories={categories} />
      <ResearchFeatured entries={entries} />
      <ResearchDirectory entries={entries} categories={categories} />
      <ResearchCta />
    </main>
  );
}
