import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { homepageContent } from "@/data/homepage";

export function HomeProcess() {
  const { process } = homepageContent;

  return (
    <section
      id="home-process"
      aria-labelledby="home-process-title"
      className="scroll-anchor border-t border-border bg-surface-muted"
    >
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={56}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">

                      <div className="lg:col-span-4">
                        <p className="type-label text-muted-foreground">{process.eyebrow}</p>
                        <Heading id="home-process-title" level={2} className="mt-4 max-w-[18ch]">
                          {process.title}
                        </Heading>
                        <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
                          {process.description}
                        </p>
                      </div>
            
                      <div className="lg:col-span-8 lg:col-start-5">
                        <ol className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4 lg:border-t-0">
                          {process.steps.map((step, index) => (
                            <li
                              key={step.number}
                              className="relative border-b border-border py-6 sm:px-5 sm:py-7 lg:border-l lg:px-6 lg:py-1 lg:first:border-l-0"
                            >
                              {index > 0 ? (
                                <span
                                  aria-hidden="true"
                                  className="absolute -left-px top-0 hidden h-px w-6 -translate-y-1/2 bg-primary lg:block"
                                />
                              ) : null}
            
                              <p className="type-label text-muted-foreground">{step.number}</p>
                              <h3 className="mt-4 type-h4 max-w-[18ch]">{step.title}</h3>
                              <p className="mt-2 type-body-sm max-w-[26ch] text-muted-foreground">
                                {step.description}
                              </p>
                            </li>
                          ))}
                        </ol>
            
                        <Link
                          href={process.action.href}
                          className="group mt-8 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                        >
                          {process.action.label}
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
