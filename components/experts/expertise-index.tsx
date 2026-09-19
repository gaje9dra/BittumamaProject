import Link from "next/link";
import { expertDisciplines as canonicalDisciplines } from "@/data/expertise";

type ExpertiseIndexProps = { disciplines?: string[] };

function disciplineAnchor(discipline: string) {
  return "expert-discipline-" + discipline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ExpertiseIndex({ disciplines = canonicalDisciplines }: ExpertiseIndexProps) {
  if (!disciplines.length) return null;

  return (
    <section aria-labelledby="expertise-index-title" className="border-b border-border bg-surface-muted">
      <div className="mx-auto grid w-full max-w-[var(--container-wide)] gap-6 px-[var(--page-gutter)] py-7 sm:py-8 lg:grid-cols-[minmax(12rem,0.35fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="type-label text-muted-foreground">Expertise index</p>
          <h2 id="expertise-index-title" className="type-h4 mt-2 max-w-[22ch]">Browse people by discipline.</h2>
        </div>
        <nav aria-label="Expertise disciplines">
          <ol className="grid border-t border-border sm:grid-cols-2">
            <li className="border-b border-border py-3 pr-5">
              <Link href="#expert-directory" className="group flex min-h-11 items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-2">
                <span className="type-caption text-muted-foreground">00</span>
                <span className="type-body-sm underline decoration-border underline-offset-4 group-hover:text-primary group-hover:decoration-primary">All experts</span>
              </Link>
            </li>
            {disciplines.map((discipline, index) => (
              <li key={discipline} className="border-b border-border py-3 pr-5">
                <Link href={"#" + disciplineAnchor(discipline)} className="group flex min-h-11 items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-2">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="type-body-sm underline decoration-border underline-offset-4 group-hover:text-primary group-hover:decoration-primary">{discipline}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
