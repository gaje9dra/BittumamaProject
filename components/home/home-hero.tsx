import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { homepageContent } from "@/data/homepage";

export function HomeHero() {
  const { hero } = homepageContent;

  return (
    <section aria-labelledby="home-hero-title" className="border-b border-border">
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] lg:items-end lg:gap-16">
          <div className="max-w-[58rem]">
            <p className="type-label text-muted-foreground">{hero.eyebrow}</p>
            <h1 id="home-hero-title" className="type-display mt-5 max-w-[11ch] text-foreground">
              {hero.title}
            </h1>
            <p className="type-body-lg mt-7 max-w-[42rem] text-muted-foreground">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={hero.primaryAction.href}
                className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                {hero.primaryAction.label}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={hero.secondaryAction.href}
                className="group inline-flex min-h-11 items-center gap-2 type-button text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                {hero.secondaryAction.label}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <figure className="relative min-h-[20rem] overflow-hidden border border-border bg-surface-muted lg:min-h-[31rem]">
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_calc(25%_-_1px),var(--border)_25%,transparent_calc(25%_+_1px),transparent_calc(50%_-_1px),var(--border)_50%,transparent_calc(50%_+_1px),transparent_calc(75%_-_1px),var(--border)_75%,transparent_calc(75%_+_1px)),linear-gradient(to_bottom,transparent_0,transparent_calc(20%_-_1px),var(--border)_20%,transparent_calc(20%_+_1px),transparent_calc(40%_-_1px),var(--border)_40%,transparent_calc(40%_+_1px),transparent_calc(60%_-_1px),var(--border)_60%,transparent_calc(60%_+_1px),transparent_calc(80%_-_1px),var(--border)_80%,transparent_calc(80%_+_1px))] opacity-70" />
            <div className="absolute inset-x-6 top-6 flex items-center justify-between border-b border-border pb-3">
              <span className="type-caption font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Visual field
              </span>
              <span className="type-caption text-muted-foreground">01</span>
            </div>
            <div className="absolute inset-x-8 bottom-8 left-8 right-8">
              <div className="border-l-2 border-primary pl-4">
                <p className="type-h4 max-w-[16ch] text-foreground">
                  Image / research visual placeholder
                </p>
                <p className="type-body-sm mt-3 max-w-[30ch] text-muted-foreground">
                  Reserved for an authentic research, people, fieldwork, or explanatory visual.
                </p>
              </div>
            </div>
            <figcaption className="sr-only">
              Placeholder for the final homepage hero visual; no fabricated organizational imagery is used.
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
