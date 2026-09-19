export type EventRegistrationStatus =
  | "Registration Open"
  | "Registration Closed"
  | "Coming Soon"
  | "Completed";

export type Event = {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  time?: string;
  category: string;
  location?: string;
  format?: "Online" | "In Person" | "Hybrid";
  shortDescription: string;
  description?: string;
  audience?: string[];
  speaker?: string;
  speakerRole?: string;
  image?: string;
  registrationLabel?: string;
  registrationHref?: string;
  href?: string;
  registrationStatus?: EventRegistrationStatus;
  featured?: boolean;
  relatedEventIds?: string[];
  relatedResearchIds?: string[];
  relatedServiceIds?: string[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export const events: Event[] = [];

export const eventCategories = Array.from(
  new Set(events.map((event) => event.category).filter(Boolean)),
);

export function getUpcomingEvents() {
  const today = new Date().toISOString().slice(0, 10);
  return events
    .filter(
      (event) =>
        event.registrationStatus !== "Completed" && event.date >= today,
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getFeaturedEvents() {
  return getUpcomingEvents().filter((event) => event.featured);
}

export function getEventsByCategory(category: string) {
  return events.filter((event) => event.category === category);
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getRelatedEvents(event: Event) {
  const relatedIds = new Set(event.relatedEventIds ?? []);
  return events.filter(
    (candidate) => candidate.id !== event.id && relatedIds.has(candidate.id),
  );
}
