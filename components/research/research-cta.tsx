import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ResearchCta() {
  return (
    <section
      aria-labelledby="research-cta-title"
      className="bg-primary text-primary-foreground"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-primary-foreground/70">02 / Research support</p>
            <Heading
              id="research-cta-title"
              level={2}
              className="mt-5 max-w-[18ch] text-primary-foreground"
            >
              Discuss a research requirement.
            </Heading>
          </div>
          <div className="lg:col-span-4 lg:pb-1">
            <p className="type-body-sm max-w-[40ch] text-primary-foreground/80">
              Tell us about your research topic, methodology or analysis requirement.
            </p>
            <Button
              asChild
              className="group mt-7 bg-background text-foreground hover:bg-surface-muted active:bg-surface-interactive"
            >
              <Link href="/contact">
                Discuss Research Support
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
