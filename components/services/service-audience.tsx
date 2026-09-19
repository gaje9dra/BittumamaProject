import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { Service } from "@/data/services";

type ServiceAudienceProps = {
  service: Service;
};

export function ServiceAudience({ service }: ServiceAudienceProps) {
  if (!service.audience) return null;

  return (
    <section aria-labelledby="service-audience-title" className="bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Who it is for</p>
            <Heading id="service-audience-title" level={2} className="mt-4 max-w-[18ch]">
              Who this service is for.
            </Heading>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="border-t border-border">
              <div className="grid gap-3 border-b border-border py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <dt className="type-caption text-muted-foreground">Suitable for</dt>
                <dd className="type-body-lg">{service.audience}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
