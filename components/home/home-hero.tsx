import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { homepageContent } from "@/data/homepage";

export function HomeHero() {
  const { hero } = homepageContent;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden"
    >
      <Container size="wide" className="pt-10 pb-0 sm:pt-14 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7 lg:col-start-1">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              <p className="type-label text-muted-foreground">{hero.eyebrow}</p>
            </div>

            <h1
              id="home-hero-title"
              className="type-display mt-6 max-w-[12ch] text-foreground"
            >
              {hero.title}
            </h1>

            <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10">
              <p className="type-body-lg max-w-[42rem] text-muted-foreground">
                {hero.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:justify-end">
                <Link
                  href={hero.primaryAction.href}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
                >
                  {hero.primaryAction.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link
                  href={hero.secondaryAction.href}
                  className="group inline-flex min-h-11 items-center gap-2 type-button text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                >
                  {hero.secondaryAction.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-14 xl:pt-20">
            <figure className="relative overflow-hidden border-y border-border bg-surface-muted">
              <div className="grid grid-cols-4 border-b border-border" aria-hidden="true">
                {[0, 1, 2, 3].map((item) => (
                  <span key={item} className="h-9 border-r border-border last:border-r-0" />
                ))}
              </div>

              <div className="relative aspect-[4/5] min-h-[22rem]">
                <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                  <span className="type-caption uppercase tracking-[0.12em] text-muted-foreground">
                    Research framework
                  </span>
                  <span className="type-caption text-muted-foreground">01—24</span>
                </div>

                <div className="absolute inset-x-5 top-16 bottom-14">
                  <svg
                    viewBox="0 0 400 300"
                    aria-hidden="true"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <line x1="0" y1="260" x2="400" y2="260" stroke="currentColor" strokeOpacity="0.18" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="currentColor" strokeOpacity="0.18" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeOpacity="0.18" />
                    <line x1="80" y1="0" x2="80" y2="300" stroke="currentColor" strokeOpacity="0.12" />
                    <line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" strokeOpacity="0.12" />
                    <line x1="320" y1="0" x2="320" y2="300" stroke="currentColor" strokeOpacity="0.12" />
                    <path
                      d="M0 236 C38 224 46 174 82 188 S124 226 154 158 S194 92 220 124 S258 190 288 112 S332 58 354 78 S384 42 400 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <circle cx="154" cy="158" r="4.5" fill="currentColor" />
                    <circle cx="288" cy="112" r="4.5" fill="currentColor" />
                    <circle cx="400" cy="28" r="4.5" fill="currentColor" />
                  </svg>
                </div>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between border-t border-border pt-3">
                  <span className="type-caption max-w-[18ch] text-muted-foreground">
Research framework
                  </span>
                  <span aria-hidden="true" className="text-primary">
                    <ArrowDown size={16} />
                  </span>
                </div>
              </div>

              <figcaption className="sr-only">
                Abstract research framework visual.
              </figcaption>
            </figure>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-12 border-t border-foreground/30 sm:mt-14 lg:mt-16"
        />
      </Container>
    </section>
  );
}
