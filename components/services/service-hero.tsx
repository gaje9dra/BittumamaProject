import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ServiceBreadcrumbs } from "@/components/services/service-breadcrumbs";
import type { Service } from "@/data/services";

type ServiceHeroProps = {
  service: Service;
};

export function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <section
      aria-labelledby="service-title"
      className="border-b border-border bg-background"
    >
      <Container size="wide" className="layout-section-lg">
        <ServiceBreadcrumbs serviceName={service.title} />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-muted-foreground">{service.category}</p>
            <Heading
              id="service-title"
              level={1}
              className="mt-5 max-w-[15ch]"
            >
              {service.title}
            </Heading>
          </div>

          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="type-body-lg max-w-[40ch] text-muted-foreground">
              {service.shortDescription}
            </p>

            <Button asChild size="lg" className="group mt-7 w-fit">
              <Link href="/contact">
                Discuss Your Requirement
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
