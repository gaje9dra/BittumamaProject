import Link from "next/link";
import { getResearchCategoryAnchor, researchCategories as canonicalCategories } from "@/data/research";

type ResearchCategoryIndexProps = {
  categories?: string[];
};

export function ResearchCategoryIndex({ categories = canonicalCategories }: ResearchCategoryIndexProps) {
  if (!categories.length) return null;

  return (
    <section aria-labelledby="research-themes-title" className="border-b border-border bg-surface-muted">
      <div className="mx-auto grid w-full max-w-[var(--container-wide)] gap-6 px-[var(--page-gutter)] py-7 sm:py-8 lg:grid-cols-[minmax(12rem,0.35fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="type-label text-muted-foreground">Research themes</p>
          <h2 id="research-themes-title" className="type-h4 mt-2 max-w-[22ch]">Browse research by area.</h2>
        </div>
        <nav aria-label="Research themes">
          <ol className="grid border-t border-border sm:grid-cols-2">
            <li className="border-b border-border py-3 pr-5">
              <Link href="#research-directory" className="group flex min-h-11 items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-2">
                <span className="type-caption text-muted-foreground">00</span>
                <span className="type-body-sm underline decoration-border underline-offset-4 group-hover:text-primary group-hover:decoration-primary">All research</span>
              </Link>
            </li>
            {categories.map((category, index) => (
              <li key={category} className="border-b border-border py-3 pr-5">
                <Link href={"#" + getResearchCategoryAnchor(category)} className="group flex min-h-11 items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-2">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="type-body-sm underline decoration-border underline-offset-4 group-hover:text-primary group-hover:decoration-primary">{category}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
