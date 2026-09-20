import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getServiceHref } from "@/lib/services/paths";
import type { ResearchEntry } from "@/data/research";
import { getServicesForResearch } from "@/lib/content/relationships";

export async function RelatedResearchServices({ research }: { research: ResearchEntry }) {
  if (!research.relatedServiceIds?.length) return null;

  const related = await getServicesForResearch(research);

  if (!related.length) return null;

  return (
    <section id="related-services" aria-labelledby="related-research-services-title" className="bg-surface-highlight scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Research support</p>
            <Heading id="related-research-services-title" level={2} className="mt-4 max-w-[18ch]">Services connected to this research.</Heading>
            <p className="type-body-sm mt-4 max-w-[38ch] text-muted-foreground">Only services explicitly connected to this research item are shown.</p>
          </div>
          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {related.map((service, index) => (
              <li key={service.id} className="border-b border-border">
                <Link href={getServiceHref(service)} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-5 py-6 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:gap-6">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <Heading level={3} className="max-w-[28ch]">{service.title}</Heading>
                    <p className="type-body-sm mt-2 max-w-[48ch] text-muted-foreground">{service.shortDescription}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
