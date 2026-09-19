import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeIntelligence() {
  const { intelligence } = homepageContent;

  return (
    <section
      id="home-research"
      aria-labelledby="home-intelligence-title"
      className="scroll-anchor bg-primary text-primary-foreground"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-5">
            <p className="type-label text-primary-foreground/70">{intelligence.eyebrow}</p>
            <Heading
              id="home-intelligence-title"
              level={2}
              className="mt-5 max-w-[17ch] text-primary-foreground"
            >
              {intelligence.title}
            </Heading>
            <Text size="lg" className="mt-7 max-w-[46ch] text-primary-foreground/80">
              {intelligence.description}
            </Text>

            <Link
              href={intelligence.action.href}
              className="group mt-9 inline-flex min-h-11 items-center gap-2 type-button text-primary-foreground underline decoration-primary-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {intelligence.action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <article className="border-y border-primary-foreground/20">
              <Link
                href={intelligence.featured.href}
                className="group block py-7 sm:py-9 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="type-caption uppercase tracking-[0.12em] text-primary-foreground/60">
                    {intelligence.featured.status}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-primary-foreground/70 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,.42fr)] sm:gap-10">
                  <div>
                    <h3 className="type-h3 max-w-[18ch] text-primary-foreground">
                      {intelligence.featured.title}
                    </h3>
                    <p className="type-body mt-5 max-w-[50ch] text-primary-foreground/75">
                      {intelligence.featured.description}
                    </p>
                  </div>

                  <div className="border-l border-primary-foreground/20 pl-5 sm:pl-6">
                    <p className="type-caption text-primary-foreground/55">Research frame</p>
                    <div className="mt-4 space-y-3">
                      {intelligence.featured.meta.map((item) => (
                        <p key={item} className="type-body-sm text-primary-foreground/80">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            <div className="mt-8 grid border-b border-primary-foreground/20 sm:grid-cols-2">
              {intelligence.themes.map((theme) => (
                <div
                  key={theme.index}
                  className="border-t border-primary-foreground/20 py-5 sm:min-h-32 sm:px-4 first:sm:pl-0"
                >
                  <span className="type-caption text-primary-foreground/50">{theme.index}</span>
                  <h3 className="type-h5 mt-2 text-primary-foreground">{theme.label}</h3>
                  <p className="type-body-sm mt-2 max-w-[34ch] text-primary-foreground/65">
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-[1fr_auto] items-end gap-6">
              <div className="relative h-24 overflow-hidden border border-primary-foreground/15 sm:h-28" aria-hidden="true">
                <svg viewBox="0 0 600 120" className="h-full w-full" preserveAspectRatio="none">
                  <path d="M0 88H600M0 60H600M0 32H600M80 0V120M200 0V120M320 0V120M440 0V120M560 0V120" stroke="currentColor" strokeOpacity="0.16" fill="none" />
                  <path d="M0 88 C70 88 74 50 130 58 S188 92 246 62 S312 22 364 48 S438 84 488 52 S548 20 600 28" stroke="currentColor" strokeOpacity="0.62" strokeWidth="2" fill="none" />
                  <circle cx="246" cy="62" r="3.5" fill="currentColor" />
                  <circle cx="488" cy="52" r="3.5" fill="currentColor" />
                </svg>
              </div>
              <p className="type-caption max-w-[18ch] text-right text-primary-foreground/50">
                Illustrative research geometry — not organizational data.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
