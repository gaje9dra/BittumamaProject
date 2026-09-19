import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getRelatedServices, type Service } from "@/data/services";

type RelatedServicesProps = {
  service: Service;
};

export function RelatedServices({ service }: RelatedServicesProps) {
  const relatedServices = getRelatedServices(service);

  if (!relatedServices.length) return null;

  return (
    <section aria-labelledby="related-services-title" className="bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Related services</p>
            <Heading id="related-services-title" level={2} className="mt-4 max-w-[18ch]">
              Continue from this service.
            </Heading>
          </div>
          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {relatedServices.map((relatedService, index) => (
              <li key={relatedService.id} className="border-b border-border">
                <Link href={relatedService.href} className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-5 py-6 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:gap-6">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <Heading level={3} className="max-w-[28ch]">{relatedService.title}</Heading>
                    <p className="type-body-sm mt-2 max-w-[48ch] text-muted-foreground">{relatedService.shortDescription}</p>
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
