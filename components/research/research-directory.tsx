import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  getResearchCategoryAnchor,
  getResearchByCategory,
  researchCategories,
  researchEntries,
} from "@/data/research";

export function ResearchDirectory() {
  const hasEntries = researchEntries.length > 0;

  return (
    <section
      id="research-directory"
      aria-labelledby="research-directory-title"
      className="scroll-anchor bg-surface-muted"
    >
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">01 / Research directory</p>
            <Heading id="research-directory-title" level={2} className="mt-4 max-w-[18ch]">
              Explore research.
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              Research entries will be listed here when verified content is available.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            {!hasEntries ? (
              <div className="border-y border-border py-8">
                <p className="type-h4">Research directory</p>
                <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">
                  Research titles, categories and summaries will appear here when approved content is available.
                </p>
              </div>
            ) : (
              <div className="border-t border-border">
                {researchCategories.map((category) => {
                  const categoryEntries = getResearchByCategory(category);

                  return (
                    <div
                      key={category}
                      id={getResearchCategoryAnchor(category)}
                      className="scroll-anchor"
                    >
                      <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                        <p className="type-label text-muted-foreground">{category}</p>
                        <span className="type-caption text-muted-foreground">
                          {String(categoryEntries.length).padStart(2, "0")} entries
                        </span>
                      </div>

                      <ol>
                        {categoryEntries.map((entry, index) => (
                          <li
                            key={`${entry.id}-${entry.slug}-${index}`}
                            className="border-b border-border"
                          >
                            <Link
                              href={entry.href}
                              className="group grid gap-5 py-7 transition-colors duration-[var(--motion-fast)] hover:bg-background/70 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(11rem,.45fr)_auto] sm:items-start sm:gap-6 sm:py-8"
                            >
                              <span className="type-caption text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div>
                                <Heading level={3} className="max-w-[24ch]">
                                  {entry.title}
                                </Heading>
                                <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">
                                  {entry.shortDescription}
                                </p>
                              </div>
                              <div className="sm:border-l sm:border-border sm:pl-6">
                                <p className="type-caption text-muted-foreground">
                                  {entry.type ?? category}
                                </p>
                                {entry.topic && (
                                  <p className="type-body-sm mt-1">{entry.topic}</p>
                                )}
                              </div>
                              <ArrowUpRight
                                aria-hidden="true"
                                className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
