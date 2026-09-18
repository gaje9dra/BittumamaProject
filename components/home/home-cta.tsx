import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { homepageContent } from "@/data/homepage";

export function HomeCta() {
  const { cta } = homepageContent;

  return (
    <section
      id="home-contact"
      aria-labelledby="home-cta-title"
      className="scroll-anchor bg-primary text-primary-foreground"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-primary-100">{cta.eyebrow}</p>
            <Heading
              id="home-cta-title"
              level={2}
              className="mt-5 max-w-[16ch] text-primary-foreground"
            >
              {cta.title}
            </Heading>
          </div>

          <div className="lg:col-span-4 lg:pb-1">
            <p className="type-body-sm max-w-[40ch] text-primary-100">
              {cta.description}
            </p>
            <Button
              asChild
              className="group mt-7 bg-background text-foreground hover:bg-surface-muted active:bg-surface-interactive"
            >
              <Link href={cta.action.href}>
                {cta.action.label}
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
