import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function ResearchHero() {
  return (
    <section
      aria-labelledby="research-title"
      className="border-b border-border bg-background"
    >
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-muted-foreground">Research &amp; Intelligence</p>
            <Heading id="research-title" level={1} className="mt-5 max-w-[13ch]">
              Research, analysis and knowledge.
            </Heading>
          </div>
          <div className="flex items-end lg:col-span-4 lg:col-start-9">
            <Text size="lg" className="max-w-[40ch] text-muted-foreground">
              A dedicated space for research work, analysis and knowledge resources.
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
}
