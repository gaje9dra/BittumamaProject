import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { Service } from "@/data/services";

type ServiceOverviewProps = {
  service: Service;
};

export function ServiceOverview({ service }: ServiceOverviewProps) {
  return (
    <section
      aria-labelledby="service-overview-title"
      className="bg-surface-muted"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">01 / Overview</p>
            <Heading
              id="service-overview-title"
              level={2}
              className="mt-4 max-w-[18ch]"
            >
              Service overview.
            </Heading>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="type-body-lg max-w-[52ch]">{service.shortDescription}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
