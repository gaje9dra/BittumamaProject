import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ArticlesIntro() {
  return (
    <section aria-labelledby="articles-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="type-label text-muted-foreground">Articles &amp; Insights</p>
            <Heading id="articles-title" level={1} className="mt-2 max-w-[24ch]">
              Research, ideas and practical insight.
            </Heading>
          </div>
          <div className="max-w-[46ch] sm:pb-1">
            <p className="type-body-sm text-muted-foreground">
              Readable editorial content on research, academic work, analysis and related topics when verified articles are published.
            </p>
            <Link href="#article-archive" className="group mt-4 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              Browse the archive
              <ArrowDown aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
