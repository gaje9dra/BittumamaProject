import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { homepageContent } from "@/data/homepage";

export function HomeAbout() {
  const { about } = homepageContent;

  return (
    <section
      id="home-about"
      aria-labelledby="home-about-title"
      className="scroll-anchor bg-background"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-5">
            <p className="type-label text-muted-foreground">{about.eyebrow}</p>
            <Heading id="home-about-title" level={2} className="mt-4 max-w-[18ch]">
              {about.title}
            </Heading>
            <p className="type-body-sm mt-5 max-w-[42ch] text-muted-foreground">
              {about.description}
            </p>
            <Link
              href={about.ctaHref}
              className="group mt-7 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {about.ctaLabel}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <ol className="lg:col-span-7 lg:col-start-6 border-t border-border">
            {about.focusAreas.map((focus, index) => (
              <li
                key={focus.title}
                className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 sm:py-6"
              >
                <span className="type-caption text-muted-foreground">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="type-h5">{focus.title}</h3>
                  <p className="type-body-sm mt-1 max-w-[48ch] text-muted-foreground">
                    {focus.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
