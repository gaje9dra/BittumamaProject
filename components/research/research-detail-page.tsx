import type { ResearchEntry } from "@/data/research";
import { ResearchDetailHero } from "@/components/research/research-detail-hero";
import { ResearchDetailSummary } from "@/components/research/research-detail-summary";
import { ResearchDetailContent } from "@/components/research/research-detail-content";
import { RelatedResearch } from "@/components/research/related-research";
import { ResearchDetailCta } from "@/components/research/research-detail-cta";

export function ResearchDetailPage({ research }: { research: ResearchEntry }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResearchDetailHero research={research} />
      <ResearchDetailSummary research={research} />
      <ResearchDetailContent research={research} />
      <RelatedResearch research={research} />
      <ResearchDetailCta />
    </main>
  );
}
