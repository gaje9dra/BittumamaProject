import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { homepageContent } from "@/data/homepage";

type Event = {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  time?: string;
  category: string;
  location?: string;
  format?: string;
  shortDescription: string;
  registrationLabel?: string;
  href?: string;
  status?: "Upcoming" | "Registration Open" | "Coming Soon" | "Completed";
  featured?: boolean;
};

export const homepageEvents: Event[] = [];

function EventMeta({ event }: { event: Event }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <span className="type-label text-muted-foreground">{event.date}</span>
      <span className="type-label text-muted-foreground">{event.category}</span>
      {event.format && <span className="type-label text-muted-foreground">{event.format}</span>}
      {event.location && <span className="type-label text-muted-foreground">{event.location}</span>}
      {event.status && (
        <span className="type-label text-primary">{event.status}</span>
      )}
    </div>
  );
}

function EventAction({ event }: { event: Event }) {
  if (!event.href) return null;
  return (
    <Link
      href={event.href}
      className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
    >
      {event.registrationLabel ?? "View Event"}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function HomeEvents() {
  const { events } = homepageContent;

  return (
    <section
      id="home-events"
      aria-labelledby="home-events-title"
      className="scroll-anchor bg-background"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">{events.eyebrow}</p>
            <Heading id="home-events-title" level={2} className="mt-4 max-w-[18ch]">
              {events.title}
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              {events.description}
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            {homepageEvents.length > 0 ? (
              <div>
                {homepageEvents.filter((event) => event.featured).slice(0, 1).map((event) => (
                  <article key={event.id} className="border-y border-border py-7 sm:py-8">
                    <EventMeta event={event} />
                    <Heading level={3} className="mt-4 max-w-[20ch]">
                      {event.title}
                    </Heading>
                    <p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">
                      {event.shortDescription}
                    </p>
                    <div className="mt-5">
                      <EventAction event={event} />
                    </div>
                  </article>
                ))}
                <div className="mt-8 border-t border-border">
                  {homepageEvents.filter((event) => !event.featured).map((event) => (
                    <article key={event.id} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                      <EventMeta event={event} />
                      <div>
                        <Heading level={4}>{event.title}</Heading>
                        <p className="type-caption mt-1 text-muted-foreground">{event.shortDescription}</p>
                      </div>
                      <EventAction event={event} />
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-y border-border py-7 sm:py-8">
                <p className="type-label text-muted-foreground">Workshops & Events</p>
                <p className="type-body-sm mt-2 max-w-[44ch] text-muted-foreground">
                  Upcoming sessions will appear here when verified event details are available.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
