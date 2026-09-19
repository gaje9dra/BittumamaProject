import Link from "next/link";
import { articleCategories as canonicalCategories } from "@/data/articles";

type ArticleCategoryNavProps = { categories?: string[] };

export function ArticleCategoryNav({ categories = canonicalCategories }: ArticleCategoryNavProps) {
  if (!categories.length) return null;

  return (
    <nav aria-label="Article topics" className="border-b border-border bg-surface-muted">
      <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center gap-5 overflow-x-auto px-[var(--page-gutter)] py-4">
        <span className="type-label shrink-0 text-muted-foreground">Topics</span>
        <Link href="#article-archive" className="type-label shrink-0 underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
          All articles
        </Link>
        {categories.map((category) => (
          <Link key={category} href={"#article-category-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} className="type-label shrink-0 text-muted-foreground underline decoration-transparent underline-offset-4 hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3">
            {category}
          </Link>
        ))}
      </div>
    </nav>
  );
}
