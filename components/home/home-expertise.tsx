import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { homepageContent } from "@/data/homepage";

export function HomeExpertise() {
  const { expertise } = homepageContent;

  return (
    <section
      id="home-expertise"
      aria-labelledby="home-expertise-title"
      className="scroll-anchor bg-surface-muted"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">{expertise.eyebrow}</p>
            <Heading id="home-expertise-title" level={2} className="mt-4 max-w-[18ch]">
              {expertise.title}
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              {expertise.description}
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            {expertise.experts.length > 0 ? (
              <ul className="border-t border-border">
                {expertise.experts.map((expert) => (
                  <li key={expert.id} className="border-b border-border py-6">
                    <Link
                      href={expert.href}
                      className="group grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,.55fr)_auto] sm:items-center sm:gap-6"
                    >
                      <span className="type-h4">{expert.name}</span>
                      <span className="type-body-sm text-muted-foreground">
                        {expert.specialization}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border-t border-border py-6">
                <p className="type-label text-muted-foreground">
                  Expert profiles
                </p>
                <p className="type-body-sm mt-2 max-w-[44ch] text-muted-foreground">
                  Expert names, fields and qualifications will appear here when verified profiles are available.
                </p>
              </div>
            )}

            <Link
              href={expertise.action.href}
              className="group mt-8 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {expertise.action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
