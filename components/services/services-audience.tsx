import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { services } from "@/data/services";

export function ServicesAudience() {
  const audiences = Array.from(new Set(services.map((service) => service.audience).filter(Boolean)));

  return (
    <section aria-labelledby="services-audience-title" className="bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Who services are for</p>
            <Heading id="services-audience-title" level={2} className="mt-4 max-w-[18ch]">
              Match the service to your research stage.
            </Heading>
          </div>
          <ul className="border-t border-border lg:col-span-8 lg:col-start-5">
            {audiences.map((audience) => {
              const audienceServices = services.filter((service) => service.audience === audience);
              return (
                <li key={audience} className="border-b border-border py-5">
                  <div className="grid gap-3 sm:grid-cols-[minmax(12rem,.45fr)_minmax(0,1fr)] sm:gap-6">
                    <p className="type-label text-muted-foreground">{audience}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {audienceServices.map((service) => (
                        <Link key={service.id} href={service.href} className="group inline-flex min-h-10 items-center gap-2 type-body-sm underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
                          {service.title}
                          <ArrowUpRight aria-hidden="true" className="size-4" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
