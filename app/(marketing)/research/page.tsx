import type { Metadata } from "next";
import { ResearchCategoryIndex } from "@/components/research/research-category-index";
import { ResearchCta } from "@/components/research/research-cta";
import { ResearchDirectory } from "@/components/research/research-directory";
import { ResearchFeatured } from "@/components/research/research-featured";
import { ResearchHero } from "@/components/research/research-hero";

export const metadata: Metadata = {
  title: "Research & Intelligence | Bittumama",
  description:
    "Research, analysis, studies and knowledge resources from Bittumama.",
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResearchHero />
      <ResearchCategoryIndex />
      <ResearchFeatured />
      <ResearchDirectory />
      <ResearchCta />
    </main>
  );
}
