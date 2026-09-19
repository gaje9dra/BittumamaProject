import Link from "next/link";
import { getServiceCategoryAnchor, serviceCategories } from "@/data/services";

export function ServicesCategoryIndex() {
  return (
    <nav aria-label="Service categories" className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center gap-5 overflow-x-auto px-[var(--page-gutter)] py-3">
        <span className="type-label shrink-0 text-muted-foreground">Categories</span>
        <Link href="#service-finder" className="type-label shrink-0 underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
          Find a service
        </Link>
        {serviceCategories.map((category) => (
          <Link key={category} href={"#" + getServiceCategoryAnchor(category)} className="type-label shrink-0 text-muted-foreground underline decoration-transparent underline-offset-4 hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3">
            {category}
          </Link>
        ))}
      </div>
    </nav>
  );
}
