import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { getAllServices, getServiceHref } from "@/data/services";

export function HomeServiceDiscovery() {
  return (
    <section
      id="home-service-discovery"
      aria-labelledby="home-service-discovery-title"
      className="scroll-anchor bg-background"
    >
      <Container size="wide" className="layout-section">
        <ScrollTransition distance={56}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">

                      <div className="lg:col-span-4">
                        <p className="type-label text-muted-foreground">Service discovery</p>
                        <Heading
                          id="home-service-discovery-title"
                          level={2}
                          className="mt-4 max-w-[18ch]"
                        >
                          Find the research service you need.
                        </Heading>
                      </div>
            
                      <div className="lg:col-span-8 lg:col-start-5">
                        <div className="border-t border-border">
                          {getAllServices().slice(0, 4).map((service, index) => (
                            <Link
                              key={service.id}
                              href={getServiceHref(service)}
                              className="group grid min-h-20 items-center gap-4 border-b border-border py-5 transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(10rem,.5fr)_auto] sm:gap-6"
                            >
                              <span className="type-caption text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                              </span>
            
                              <span className="type-h4 max-w-[24ch] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5">
                                {service.title}
                              </span>
            
                              <span className="type-body-sm text-muted-foreground">
                                {service.shortDescription}
                              </span>
            
                              <ArrowUpRight
                                aria-hidden="true"
                                className="size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          ))}
                        </div>
            
                        <Link
                          href="/services"
                          className="group mt-7 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                        >
                          View All Services
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
          </div>
        </ScrollTransition>
      </Container>
    </section>
  );
}
