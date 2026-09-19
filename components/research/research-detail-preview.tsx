import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ResearchDetailHero } from "@/components/research/research-detail-hero";
import { ResearchDetailSummary } from "@/components/research/research-detail-summary";
import { ResearchDetailContent } from "@/components/research/research-detail-content";
import { ResearchDetailCta } from "@/components/research/research-detail-cta";
import type { ResearchEntry } from "@/data/research";

const previewResearch: ResearchEntry = {
  id: "development-preview",
  title: "Development research detail preview",
  slug: "development-preview",
  category: "Development reference",
  type: "Preview",
  topic: "Research detail architecture",
  shortDescription: "Development-only content used to inspect the research detail hierarchy and responsive composition.",
  date: "Development reference",
  status: "Published",
  href: "/research/development-preview",
  tags: ["research-detail-preview"],
  sections: [
    {
      id: "section-one",
      title: "Structured content",
      content: "This development-only section demonstrates how concise research content can be rendered without introducing a rich-text editor.",
    },
    {
      id: "section-two",
      title: "Supporting context",
      content: "Real research sections will render here only when supplied by the canonical research data.",
    },
  ],
};

const previewRelated: ResearchEntry[] = [
  {
    ...previewResearch,
    id: "development-related",
    slug: "development-related",
    title: "Development related-item preview",
    shortDescription: "Development-only related research row.",
    href: "/research/development-related",
    tags: ["research-detail-preview"],
  },
];

export default function ResearchDetailPreview() {
  return (
    <div className="space-y-0">
      <ResearchDetailHero research={previewResearch} />
      <ResearchDetailSummary research={previewResearch} />
      <ResearchDetailContent research={previewResearch} />

      <section aria-labelledby="preview-related-title" className="bg-surface-muted">
        <Container size="wide" className="layout-section-lg">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
            <div className="lg:col-span-4">
              <p className="type-label text-muted-foreground">Related research</p>
              <Heading id="preview-related-title" level={2} className="mt-4 max-w-[18ch]">
                Related-item preview.
              </Heading>
            </div>
            <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
              {previewRelated.map((item) => (
                <li key={item.id} className="border-b border-border">
                  <Link href={item.href} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-5 py-6 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:gap-6">
                    <span className="type-caption text-muted-foreground">01</span>
                    <div>
                      <Heading level={3}>{item.title}</Heading>
                      <p className="type-body-sm mt-2 text-muted-foreground">{item.shortDescription}</p>
                    </div>
                    <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <ResearchDetailCta />
    </div>
  );
}
