import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getFeaturedResearch, type ResearchEntry } from "@/data/research";

type ResearchFeaturedProps = {
  entries?: ResearchEntry[];
};

export function ResearchFeatured({ entries }: ResearchFeaturedProps) {
  const featured = (entries ?? getFeaturedResearch()).filter((entry) => entry.featured);
  if (!featured.length) return null;

  const entry = featured[0];

  return (
    <section aria-labelledby="featured-research-title" className="border-b border-border bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground">Featured research</p>
          </div>
          <article className="lg:col-span-8 lg:col-start-4">
            <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10">
              <div>
                <Heading id="featured-research-title" level={2} className="max-w-[24ch]">
                  {entry.title}
                </Heading>
                <p className="type-body-sm mt-4 max-w-[58ch] text-muted-foreground">
                  {entry.summary ?? entry.shortDescription}
                </p>
                <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <dt className="type-caption text-muted-foreground">Type</dt>
                    <dd className="type-body-sm mt-1">{entry.type ?? "Research"}</dd>
                  </div>
                  <div>
                    <dt className="type-caption text-muted-foreground">Category</dt>
                    <dd className="type-body-sm mt-1">{entry.category}</dd>
                  </div>
                  {entry.date && (
                    <div>
                      <dt className="type-caption text-muted-foreground">Date</dt>
                      <dd className="type-body-sm mt-1">{entry.date}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="sm:self-end">
                <Link
                  href={entry.href}
                  className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                >
                  View research
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
