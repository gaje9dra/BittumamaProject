import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { ResearchEntry } from "@/data/research";

export function ResearchDetailSummary({ research }: { research: ResearchEntry }) {
  if (!research.summary) return null;
  return (
    <section aria-labelledby="research-summary-title" className="bg-background">
      <Container size="reading" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Research summary</p>
        <Heading id="research-summary-title" level={2} className="mt-4 max-w-[22ch]">What this research covers.</Heading>
        <p className="type-body-lg mt-6">{research.summary}</p>
      </Container>
    </section>
  );
}
