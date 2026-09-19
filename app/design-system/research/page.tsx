import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ResearchCategoryIndex } from "@/components/research/research-category-index";
import { ResearchDirectory } from "@/components/research/research-directory";
import { ResearchFeatured } from "@/components/research/research-featured";
import { ResearchHero } from "@/components/research/research-hero";
import type { ResearchEntry } from "@/data/research";

const previewEntries: ResearchEntry[] = [
  {
    id: "preview-methodology",
    title: "Research Methodology Overview",
    slug: "preview-methodology",
    category: "Research Methods",
    type: "Research resource",
    shortDescription: "Development-only preview content for the research index and featured treatment.",
    summary: "A preview record used to inspect research discovery without adding development content to the production dataset.",
    date: "Development reference",
    href: "/research/preview-methodology",
    featured: true,
    tags: ["development-preview"],
  },
  {
    id: "preview-analysis",
    title: "Data Analysis Research Note",
    slug: "preview-analysis",
    category: "Research Analysis",
    type: "Research note",
    shortDescription: "Development-only indexed research content with a secondary theme.",
    date: "Development reference",
    href: "/research/preview-analysis",
    tags: ["development-preview"],
  },
];

export default function ResearchPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const previewCategories = Array.from(new Set(previewEntries.map((entry) => entry.category)));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">
            Research &amp; Intelligence
          </Heading>
          <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
            Development-only preview for research themes, featured research, indexed discovery and production empty-state behavior. Preview records never enter the production research dataset.
          </p>
        </Container>
      </section>
      <ResearchHero />
      <ResearchCategoryIndex categories={previewCategories} />
      <ResearchFeatured entries={previewEntries} />
      <ResearchDirectory entries={previewEntries} categories={previewCategories} />
    </main>
  );
}
