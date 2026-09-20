import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getServiceCategoryAnchor, getServiceHref } from "@/data/services";
import type { Service } from "@/data/services";

export function ServicesDirectory({ services }: { services: Service[] }) {
  return (
    <section id="service-directory" aria-labelledby="service-directory-title" className="scroll-anchor bg-background">
      <Container size="wide" className="layout-section-xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="type-label text-muted-foreground">Service catalogue</p>
            <Heading id="service-directory-title" level={2} className="mt-3 max-w-[20ch]">
              Find the service that fits your requirement.
            </Heading>
          </div>
          <p className="type-caption max-w-[34ch] text-muted-foreground">
            Select a service to view its scope, audience and available guidance.
          </p>
        </div>

        <div className="border-t border-border">
          {Array.from(new Set(services.map((service) => service.category))).map((category) => {
            const categoryServices = services.filter((service) => service.category === category);
            return (
              <section key={category} id={getServiceCategoryAnchor(category)} className="scroll-anchor">
                <div className="flex items-center justify-between gap-6 border-b border-border bg-surface-muted px-4 py-3 sm:px-5">
                  <p className="type-label">{category}</p>
                  <span className="type-caption text-muted-foreground">{String(categoryServices.length).padStart(2, "0")}</span>
                </div>
                <ol>
                  {categoryServices.map((service, index) => (
                    <li key={service.id} className="border-b border-border">
                      <Link
                        href={getServiceHref(service)}
                        className="group grid gap-5 px-0 py-6 transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1.25fr)_minmax(12rem,.7fr)_minmax(9rem,.55fr)_auto] sm:items-start sm:gap-6 sm:px-5"
                      >
                        <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <Heading level={3} className="max-w-[24ch]">{service.title}</Heading>
                            {service.status === "Coming Soon" && (
                              <span className="type-caption border border-border px-2 py-1 text-muted-foreground">Coming Soon</span>
                            )}
                          </div>
                          <p className="type-body-sm mt-2 max-w-[52ch] text-muted-foreground">{service.shortDescription}</p>
                        </div>
                        <div className="sm:border-l sm:border-border sm:pl-5">
                          <p className="type-caption text-muted-foreground">Need</p>
                          <p className="type-body-sm mt-1">{service.need ?? "—"}</p>
                        </div>
                        <div className="sm:border-l sm:border-border sm:pl-5">
                          <p className="type-caption text-muted-foreground">For</p>
                          <p className="type-body-sm mt-1">{service.audience ?? "—"}</p>
                        </div>
                        <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
