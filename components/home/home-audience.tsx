import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { homepageContent } from "@/data/homepage";

export function HomeAudience() {
  const { audience } = homepageContent;

  return (
    <section
      id="home-audience"
      aria-labelledby="home-audience-title"
      className="scroll-anchor bg-surface-muted"
    >
      <Container size="wide" className="layout-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <ScrollTransition distance={56}>

                      <div className="lg:col-span-4">
                        <p className="type-label text-muted-foreground">{audience.eyebrow}</p>
                        <Heading id="home-audience-title" level={2} className="mt-4 max-w-[18ch]">
                          {audience.title}
                        </Heading>
                        <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
                          {audience.description}
                        </p>
                      </div>
            
                      <div className="lg:col-span-8 lg:col-start-5">
                        <ol className="border-t border-border">
                          {audience.items.map((item) => (
                            <li key={item.index} className="grid gap-5 border-b border-border py-7 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(15rem,.65fr)] sm:gap-6 sm:py-8">
                              <span className="type-caption text-muted-foreground">{item.index}</span>
            
                              <div>
                                <h3 className="type-h4 max-w-[22ch]">{item.title}</h3>
                                <p className="type-body-sm mt-2 max-w-[42ch] text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
            
                              <ul className="grid gap-1.5 sm:border-l sm:border-border sm:pl-6">
                                {item.services.map((service) => (
                                  <li key={service.href}>
                                    <Link
                                      href={service.href}
                                      className="group inline-flex min-h-10 items-center gap-2 type-body-sm font-medium text-primary underline decoration-primary/20 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                                    >
                                      {service.label}
                                      <ArrowUpRight
                                        aria-hidden="true"
                                        className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                      />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ol>
                      </div>
          </ScrollTransition>
        </div>
      </Container>
    </section>
  );
}
