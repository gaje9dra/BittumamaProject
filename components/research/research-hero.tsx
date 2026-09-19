import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ResearchHero() {
  return (
    <section aria-labelledby="research-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-muted-foreground">Research &amp; Intelligence</p>
            <Heading id="research-title" level={1} className="mt-4 max-w-[16ch]">
              Research, analysis and knowledge.
            </Heading>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="type-body-sm max-w-[40ch] text-muted-foreground">
              A knowledge hub for research themes, studies, analysis and research resources.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
