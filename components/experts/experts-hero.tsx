import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollHeading } from "@/components/ui/scroll-heading";

export function ExpertsHero() {
  return (
    <section aria-labelledby="experts-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7">
            <p className="type-label text-muted-foreground">Experts</p>
            <ScrollHeading id="experts-title" level={1} className="mt-3 max-w-[20ch]">
              People with expertise across research, analysis and academic work.
            </ScrollHeading>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="type-body-sm max-w-[44ch] text-muted-foreground">
              Explore verified Bittumama expert profiles by discipline and area of expertise.
            </p>
            <Link href="#expert-directory" className="group mt-5 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              Browse people
              <ArrowDown aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
