"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getAllServices } from "@/data/services";

const needs = Array.from(
  new Set(
    getAllServices()
      .map((service) => service.need)
      .filter((need): need is string => Boolean(need)),
  ),
);

export function ServiceFinder() {
  const [selectedNeed, setSelectedNeed] = useState(needs[0]);

  const matches = useMemo(
    () => getAllServices().filter((service) => service.need === selectedNeed),
    [selectedNeed],
  );

  return (
    <section id="service-finder" aria-labelledby="service-finder-title" className="scroll-anchor border-b border-border bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Service finder</p>
            <Heading id="service-finder-title" level={2} className="mt-4 max-w-[18ch]">
              What do you need help with?
            </Heading>
            <p className="type-body-sm mt-4 max-w-[38ch] text-muted-foreground">
              Select the requirement closest to your current research work.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="grid border-t border-border sm:grid-cols-2">
              {needs.map((need) => {
                const active = need === selectedNeed;
                return (
                  <button
                    key={need}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedNeed(need)}
                    className="group flex min-h-16 items-center justify-between gap-4 border-b border-border px-0 py-4 text-left transition-colors duration-[var(--motion-fast)] hover:bg-background/70 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:px-5"
                  >
                    <span className={active ? "type-body-sm text-foreground" : "type-body-sm text-muted-foreground group-hover:text-foreground"}>
                      {need}
                    </span>
                    {active ? (
                      <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    ) : (
                      <span aria-hidden="true" className="size-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" className="mt-6 border-y border-border bg-background px-5 py-5">
              <p className="type-label text-muted-foreground">Relevant service</p>
              {matches.length ? (
                <div className="mt-3">
                  {matches.map((service) => (
                    <Link
                      key={service.id}
                      href={service.href}
                      className="group flex min-h-11 items-center justify-between gap-5"
                    >
                      <span>
                        <span className="type-h5 block">{service.title}</span>
                        <span className="type-caption mt-1 block text-muted-foreground">{service.shortDescription}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="type-body-sm mt-2 text-muted-foreground">
                  No service is currently mapped to this requirement.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
