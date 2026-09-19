import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { Service } from "@/data/services";

type ServiceAudienceProps = {
  service: Service;
};

export function ServiceAudience({ service }: ServiceAudienceProps) {
  if (!service.audience && !service.need && !service.focus) return null;

  return (
    <section aria-labelledby="service-relevance-title" className="bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Service relevance</p>
            <Heading id="service-relevance-title" level={2} className="mt-4 max-w-[18ch]">
              Is this the support you need?
            </Heading>
          </div>
          <dl className="border-t border-border lg:col-span-8 lg:col-start-5">
            {service.need && (
              <div className="grid gap-3 border-b border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="type-caption text-muted-foreground">Addresses</dt>
                <dd className="type-body-lg">{service.need}</dd>
              </div>
            )}
            {service.focus && (
              <div className="grid gap-3 border-b border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="type-caption text-muted-foreground">Focus</dt>
                <dd className="type-body-lg">{service.focus}</dd>
              </div>
            )}
            {service.audience && (
              <div className="grid gap-3 border-b border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="type-caption text-muted-foreground">Suitable for</dt>
                <dd className="type-body-lg">{service.audience}</dd>
              </div>
            )}
          </dl>
        </div>
      </Container>
    </section>
  );
}
