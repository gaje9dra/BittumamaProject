import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getResearchCategoryAnchor, getResearchByCategory, researchCategories, researchEntries } from "@/data/research";

export function ResearchDirectory() {
  const hasEntries = researchEntries.length > 0;

  return (
    <section id="research-directory" aria-labelledby="research-directory-title" className="scroll-anchor bg-background">
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground">Research index</p>
            <Heading id="research-directory-title" level={2} className="mt-4 max-w-[16ch]">
              Knowledge archive.
            </Heading>
          </div>
          <div className="lg:col-span-9 lg:col-start-4">
            {!hasEntries ? (
              <div className="border-y border-border py-8 sm:py-10">
                <div className="grid gap-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
                  <p className="type-label text-muted-foreground">Archive</p>
                  <div>
                    <p className="type-h4 max-w-[28ch]">Published research will appear here.</p>
                    <p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">
                      The directory is ready for verified studies, reports, analyses and other research resources.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-border">
                {researchCategories.map((category) => {
                  const entries = getResearchByCategory(category);
                  return (
                    <section key={category} id={getResearchCategoryAnchor(category)} className="scroll-anchor">
                      <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <p className="type-label text-muted-foreground">{category}</p>
                        <span className="type-caption text-muted-foreground">{String(entries.length).padStart(2, "0")} entries</span>
                      </div>
                      <ol>
                        {entries.map((entry, index) => (
                          <li key={entry.id} className="border-b border-border">
                            <Link href={entry.href} className="group grid gap-4 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_8rem_auto] sm:items-start sm:gap-6">
                              <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                              <div>
                                <Heading level={3} className="max-w-[30ch]">{entry.title}</Heading>
                                <p className="type-body-sm mt-2 max-w-[56ch] text-muted-foreground">{entry.shortDescription}</p>
                              </div>
                              <div className="sm:border-l sm:border-border sm:pl-5">
                                <p className="type-caption text-muted-foreground">{entry.type ?? "Research"}</p>
                                {entry.date && <p className="type-caption mt-2 text-muted-foreground">{entry.date}</p>}
                              </div>
                              <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </section>
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
