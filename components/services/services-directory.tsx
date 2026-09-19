import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  getServiceCategoryAnchor,
  getServicesByCategory,
  serviceCategories,
} from "@/data/services";

export function ServicesDirectory() {
  return (
    <section
      id="service-directory"
      aria-labelledby="service-directory-title"
      className="scroll-anchor bg-surface-muted"
    >
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">01 / Service directory</p>
            <Heading id="service-directory-title" level={2} className="mt-4 max-w-[18ch]">
              Find the support you need.
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              Browse the current research and academic services by requirement.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-t border-border">
              {serviceCategories.map((category) => {
                const categoryServices = getServicesByCategory(category);

                return (
                  <div
                    key={category}
                    id={getServiceCategoryAnchor(category)}
                    className="scroll-anchor"
                  >
                    <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                      <p className="type-label text-muted-foreground">{category}</p>
                      <span className="type-caption text-muted-foreground">
                        {String(categoryServices.length).padStart(2, "0")} services
                      </span>
                    </div>

                    <ol>
                      {categoryServices.map((service, index) => (
                        <li key={`${service.id}-${service.slug}-${index}`} className="border-b border-border">
                          <Link
                            href={service.href}
                            className="group grid gap-5 py-7 transition-colors duration-[var(--motion-fast)] hover:bg-background/70 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(11rem,.45fr)_auto] sm:items-start sm:gap-6 sm:py-8"
                          >
                            <span className="type-caption text-muted-foreground">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div>
                              <Heading level={3} className="max-w-[24ch] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5">
                                {service.title}
                              </Heading>
                              <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">
                                {service.shortDescription}
                              </p>
                            </div>

                            {service.audience && (
                              <div className="sm:border-l sm:border-border sm:pl-6">
                                <p className="type-caption text-muted-foreground">For</p>
                                <p className="type-body-sm mt-1">{service.audience}</p>
                              </div>
                            )}

                            <ArrowUpRight
                              aria-hidden="true"
                              className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
