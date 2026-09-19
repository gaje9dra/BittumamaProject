import Link from "next/link";
import { getResearchCategoryAnchor, researchCategories } from "@/data/research";

export function ResearchCategoryIndex() {
  return (
    <nav aria-label="Research themes" className="border-b border-border bg-surface-muted">
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-[var(--page-gutter)]">
        <div className="flex items-center gap-6 overflow-x-auto py-4">
          <span className="type-label shrink-0 text-muted-foreground">Themes</span>
          <Link href="#research-directory" className="type-label shrink-0 underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
            All research
          </Link>
          {researchCategories.map((category) => (
            <Link key={category} href={"#" + getResearchCategoryAnchor(category)} className="type-label shrink-0 text-muted-foreground underline decoration-transparent underline-offset-4 hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3">
              {category}
            </Link>
          ))}
          {!researchCategories.length && (
            <span className="type-caption shrink-0 text-muted-foreground">Themes will appear with published research.</span>
          )}
        </div>
      </div>
    </nav>
  );
}
