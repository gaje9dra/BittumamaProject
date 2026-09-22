import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { LocationPage } from "@/data/locations";
import type { Service } from "@/data/services";
import { Container } from "@/components/ui/container";

type LocationPageViewProps = {
  location: LocationPage;
  services: readonly Service[];
};

const FALLBACK_PROCESS = [
  {
    title: "Requirement",
    description: "Start with the research, thesis, paper, analysis or editing requirement and the material already available.",
  },
  {
    title: "Scope",
    description: "Match the request to the relevant canonical Bittumama service and define the requested scope.",
  },
  {
    title: "Research support",
    description: "Work through the selected research, writing, analysis or editing task using the supplied project context.",
  },
  {
    title: "Review & delivery",
    description: "Check the requested deliverable and revisions before completing the agreed service.",
  },
];

export function LocationPageView({ location, services }: LocationPageViewProps) {
  const serviceBySlug = new Map(services.map((service) => [service.slug, service]));
  const relatedServices = location.serviceSlugs
    .map((slug) => serviceBySlug.get(slug))
    .filter((service): service is Service => Boolean(service));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border">
        <Container size="wide" className="py-8 sm:py-10 lg:py-14">
          <Link
            href="/#global-presence"
            className="inline-flex items-center gap-2 type-caption text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Explore Global Presence
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-14">
            <div>
              <p className="type-label text-primary">{location.region} / {location.country}</p>
              <h1 className="type-h1 mt-4 max-w-[15ch]">{location.heading}</h1>
              <p className="type-body mt-6 max-w-[58ch] text-muted-foreground">{location.introduction}</p>

              <dl className="mt-8 grid max-w-xl grid-cols-2 border-y border-border">
                <div className="border-r border-border py-4 pr-5">
                  <dt className="type-label text-muted-foreground">Location</dt>
                  <dd className="mt-1 type-body-sm">{location.city}, {location.country}</dd>
                </div>
                <div className="py-4 pl-5">
                  <dt className="type-label text-muted-foreground">Service model</dt>
                  <dd className="mt-1 type-body-sm">Remote support</dd>
                </div>
              </dl>
            </div>

            <figure className="relative aspect-[16/10] min-h-[18rem] overflow-hidden border border-border bg-surface">
              <Image
                src={location.image}
                alt={location.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-14 type-caption text-white/85">
                {location.city}, {location.country}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section aria-labelledby="location-support-title">
        <Container size="wide" className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-18">
          <div>
            <p className="type-label text-primary">How we support clients here</p>
            <h2 id="location-support-title" className="type-h2 mt-3 max-w-[15ch]">A service relationship built around the actual research requirement.</h2>
          </div>
          <div className="max-w-3xl">
            <p className="type-body text-muted-foreground">{location.clientContext}</p>
            <p className="type-body mt-5 text-muted-foreground">{location.deliveryApproach}</p>
            <p className="mt-6 border-l-2 border-primary pl-4 type-body-sm text-foreground">
              Services are delivered remotely, allowing clients in {location.city} to work with Bittumama from their location.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="location-services-title" className="border-y border-border bg-surface-muted">
        <Container size="wide" className="py-12 sm:py-14 lg:py-16">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label text-primary">Relevant services</p>
              <h2 id="location-services-title" className="type-h2 mt-3">Services selected for this location</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 type-button text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Explore all services
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-8 divide-y divide-border border-y border-border">
            {relatedServices.map((service, index) => (
              <Link
                key={service.slug}
                href={"/services/" + service.slug}
                className="group grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block type-h4">{service.title}</span>
                  <span className="mt-1 block type-body-sm text-muted-foreground">{service.shortDescription}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-primary transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="location-process-title">
        <Container size="wide" className="py-12 sm:py-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="type-label text-primary">Service process</p>
            <h2 id="location-process-title" className="type-h2 mt-3">From requirement to requested deliverable.</h2>
          </div>

          <ol className="mt-9 grid gap-0 border-y border-border lg:grid-cols-4">
            {(location.process.length ? location.process : FALLBACK_PROCESS).map((step, index) => (
              <li key={step.title} className="border-b border-border py-6 last:border-b-0 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <h3 className="mt-4 type-h4">{step.title}</h3>
                <p className="mt-2 type-body-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
            <div>
              <p className="type-label text-primary">Research & academic support areas</p>
              <ul className="mt-4 flex max-w-3xl flex-wrap gap-x-5 gap-y-3">
                {location.supportAreas.map((area) => (
                  <li key={area} className="type-body-sm border-b border-border pb-1">{area}</li>
                ))}
              </ul>
            </div>
            <div className="lg:text-right">
              <p className="type-caption text-muted-foreground">No local branch or local business claim is implied by this page.</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="location-cta-title" className="border-t border-border bg-primary text-primary-foreground">
        <Container size="wide" className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-16">
          <div>
            <p className="type-label text-primary-foreground/65">Request support</p>
            <h2 id="location-cta-title" className="type-h2 mt-3 max-w-[18ch]">Have a research requirement from {location.city}?</h2>
            <p className="mt-4 max-w-[55ch] type-body-sm text-primary-foreground/75">Share the project context and the kind of support you need. The existing enquiry flow can then capture the requirement.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={"/contact?location=" + encodeURIComponent(location.id)}
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-background px-5 type-button text-foreground transition-transform duration-[var(--motion-fast)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-background"
            >
              Request support
              <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-primary-foreground/30 px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:border-primary-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-background"
            >
              Explore services
            </Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="location-related-title">
        <Container size="wide" className="py-10 sm:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="type-label text-muted-foreground">Continue exploring</p>
              <h2 id="location-related-title" className="mt-2 type-h3">Global Presence</h2>
            </div>
            <Link href="/#global-presence" className="inline-flex items-center gap-2 type-button text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Explore other locations
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
