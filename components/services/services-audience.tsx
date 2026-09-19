import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { services } from "@/data/services";

export function ServicesAudience() {
  const studentResearcherServices = services.filter(
    (service) => service.audience === "Students and researchers",
  );

  return (
    <section
      aria-labelledby="services-audience-title"
      className="bg-background"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">02 / Who these services are for</p>
            <Heading id="services-audience-title" level={2} className="mt-4 max-w-[18ch]">
              For students and researchers.
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              Select a service based on the academic requirement you are working on.
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <ul className="border-t border-border">
              {studentResearcherServices.map((service) => (
                <li key={service.id} className="border-b border-border">
                  <Link
                    href={service.href}
                    className="group flex min-h-16 items-center justify-between gap-6 py-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <span className="type-body-sm">{service.title}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
