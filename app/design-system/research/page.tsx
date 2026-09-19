import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ResearchCategoryIndex } from "@/components/research/research-category-index";
import { ResearchDirectory } from "@/components/research/research-directory";
import { ResearchHero } from "@/components/research/research-hero";

export default function ResearchPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">
            Research &amp; Intelligence
          </Heading>
          <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
            Preview of the research directory foundation, category navigation and empty-state behavior.
          </p>
        </Container>
      </section>
      <ResearchHero />
      <ResearchCategoryIndex />
      <ResearchDirectory />
    </main>
  );
}
