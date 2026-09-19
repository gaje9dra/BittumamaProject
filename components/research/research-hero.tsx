import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ResearchHero() {
  return (
    <section aria-labelledby="research-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7">
            <p className="type-label text-muted-foreground">Research &amp; Intelligence</p>
            <Heading id="research-title" level={1} className="mt-3 max-w-[20ch]">
              Research work, analysis and knowledge resources.
            </Heading>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="type-body-sm max-w-[44ch] text-muted-foreground">
              Explore the research areas and published work available through Bittumama. New research is added only when verified content is available.
            </p>
            <Link href="#research-directory" className="group mt-5 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              Browse the research index
              <ArrowDown aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
