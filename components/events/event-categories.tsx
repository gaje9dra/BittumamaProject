import Link from "next/link";
import { Container } from "@/components/ui/container";

export function EventCategories({ categories }: { categories: string[] }) {
  if (categories.length < 2) return null;

  return (
    <section aria-labelledby="event-categories-title" className="border-b border-border">
      <Container width="standard" className="py-10">
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
          <h2 id="event-categories-title" className="type-label text-muted-foreground">Browse by format</h2>
          {categories.map((category) => (
            <Link
              key={category}
              href={"#event-category-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="type-button text-foreground underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {category}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
