import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { ResearchEntry } from "@/data/research";

export function ResearchDetailContent({ research }: { research: ResearchEntry }) {
  if (!research.sections?.length) return null;
  return (
    <section aria-labelledby="research-content-title" className="bg-surface-muted">
      <Container size="reading" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Research content</p>
        <Heading id="research-content-title" level={2} className="mt-4 max-w-[22ch]">Research sections.</Heading>
        <div className="mt-10 space-y-12">
          {research.sections.map((item) => {
            const headingId = "research-section-" + item.id;
            return (
              <section key={item.id} aria-labelledby={headingId}>
                <Heading id={headingId} level={3}>{item.title}</Heading>
                <p className="type-body mt-4 whitespace-pre-line">{item.content}</p>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
