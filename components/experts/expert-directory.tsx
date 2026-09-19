import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { expertDisciplines as canonicalDisciplines, experts as canonicalExperts, type Expert } from "@/data/expertise";

type ExpertDirectoryProps = { experts?: Expert[]; disciplines?: string[] };

function disciplineAnchor(discipline: string) {
  return "expert-discipline-" + discipline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ExpertDirectory({ experts = canonicalExperts, disciplines = canonicalDisciplines }: ExpertDirectoryProps) {
  if (!experts.length) {
    return (
      <section id="expert-directory" aria-labelledby="expert-directory-title" className="scroll-anchor bg-background">
        <Container size="wide" className="layout-section-lg">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
            <div className="lg:col-span-3">
              <p className="type-label text-muted-foreground">People index</p>
              <Heading id="expert-directory-title" level={2} className="mt-3 max-w-[18ch]">Expert profiles.</Heading>
            </div>
            <div className="lg:col-span-9 lg:col-start-4">
              <div className="border-y border-border py-8 sm:py-10">
                <p className="type-h4 max-w-[30ch]">Verified expert profiles will appear here.</p>
                <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
                  The people directory is ready for approved names, disciplines, expertise and professional profile information.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="expert-directory" aria-labelledby="expert-directory-title" className="scroll-anchor bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground">People index</p>
            <Heading id="expert-directory-title" level={2} className="mt-3 max-w-[18ch]">People and expertise.</Heading>
            <p className="type-body-sm mt-4 max-w-[30ch] text-muted-foreground">Explore each profile for verified role, discipline and areas of expertise.</p>
          </div>
          <div className="lg:col-span-9 lg:col-start-4">
            <div className="border-t border-border">
              {disciplines.map((discipline) => {
                const group = experts.filter((expert) => expert.discipline === discipline);
                if (!group.length) return null;
                return (
                  <section key={discipline} id={disciplineAnchor(discipline)} className="scroll-anchor">
                    <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <p className="type-label text-muted-foreground">{discipline}</p>
                      <span className="type-caption text-muted-foreground">{String(group.length).padStart(2, "0")} profiles</span>
                    </div>
                    <ol>
                      {group.map((expert, index) => (
                        <li key={expert.id} className="border-b border-border">
                          <Link href={"/experts/" + expert.slug} className="group grid gap-4 py-6 focus-visible:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(12rem,.6fr)_auto] sm:items-start sm:gap-6">
                            <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <Heading level={3} className="max-w-[30ch]">{expert.name}</Heading>
                              {expert.role && <p className="type-caption mt-2 text-muted-foreground">{expert.role}</p>}
                            </div>
                            <div>
                              {expert.shortBio && <p className="type-body-sm max-w-[42ch] text-muted-foreground">{expert.shortBio}</p>}
                              {expert.expertise?.length ? <p className="type-caption mt-3 text-muted-foreground">{expert.expertise.slice(0, 3).join(" · ")}</p> : null}
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
          </div>
        </div>
      </Container>
    </section>
  );
}
