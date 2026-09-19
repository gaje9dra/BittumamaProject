import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import ResearchDetailPreview from "@/components/research/research-detail-preview";

export default function ResearchDetailPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">
            Research detail page
          </Heading>
          <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
            Development-only preview for the research detail hierarchy, metadata, structured sections, related-item treatment and final directory action.
          </p>
        </Container>
      </section>
      <ResearchDetailPreview />
    </main>
  );
}
