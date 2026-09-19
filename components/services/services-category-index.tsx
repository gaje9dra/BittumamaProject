import Link from "next/link";
import { getServiceCategoryAnchor, serviceCategories } from "@/data/services";

export function ServicesCategoryIndex() {
  if (serviceCategories.length <= 1) return null;

  return (
    <nav
      aria-label="Service categories"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-[var(--page-gutter)]">
        <div className="overflow-x-auto">
          <ul className="flex min-w-max items-center gap-6 py-4">
            {serviceCategories.map((category) => (
              <li key={category}>
                <Link
                  href={`#${getServiceCategoryAnchor(category)}`}
                  className="inline-flex min-h-10 items-center type-label text-muted-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
