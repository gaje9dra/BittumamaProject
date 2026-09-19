import type { ResearchEntry } from "@/data/research";
import { ResearchDetailHero } from "@/components/research/research-detail-hero";
import {
  ResearchDetailAudience,
  ResearchDetailContent,
  ResearchDetailHighlights,
  ResearchDetailMethodology,
  ResearchDetailOverview,
  ResearchDetailScope,
  ResearchDetailTopics,
  ResearchContents,
} from "@/components/research/research-detail-content";
import { RelatedResearch } from "@/components/research/related-research";
import { RelatedResearchServices } from "@/components/research/related-research-services";
import { ResearchDetailCta } from "@/components/research/research-detail-cta";

export function ResearchDetailPage({ research }: { research: ResearchEntry }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResearchDetailHero research={research} />
      <ResearchContents research={research} />
      <ResearchDetailOverview research={research} />
      <ResearchDetailScope research={research} />
      <ResearchDetailTopics research={research} />
      <ResearchDetailContent research={research} />
      <ResearchDetailMethodology research={research} />
      <ResearchDetailAudience research={research} />
      <ResearchDetailHighlights research={research} />
      <RelatedResearch research={research} />
      <RelatedResearchServices research={research} />
      <ResearchDetailCta />
    </main>
  );
}
