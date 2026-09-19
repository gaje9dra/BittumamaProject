export type EventRegistrationStatus =
  | "Registration Open"
  | "Registration Closed"
  | "Coming Soon"
  | "Completed";

export type EventFormat = "Online" | "In Person" | "Hybrid";

export type Event = {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  time?: string;
  category: string;
  location?: string;
  format?: EventFormat;
  shortDescription: string;
  description?: string;
  audience?: string[];
  speaker?: string;
  speakerId?: string;
  speakerSlug?: string;
  speakerRole?: string;
  image?: string;
  registrationLabel?: string;
  registrationHref?: string;
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

export function getAllEvents() {
  return events;
}

export const eventCategories = Array.from(
  new Set(events.map((event) => event.category).filter(Boolean)),
);

export function getEventById(id: string) {
  return events.find((event) => event.id === id);
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

function parseEventDate(value: string) {
  const parsed = new Date(value.includes("T") ? value : value + "T23:59:59");
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function isUpcomingEvent(event: Event, now = new Date()) {
  const end = event.endDate ? parseEventDate(event.endDate) : parseEventDate(event.date);
  return end ? end >= now : false;
}

export function getUpcomingEvents(now = new Date()) {
  return events.filter((event) => isUpcomingEvent(event, now));
}

export function getPastEvents(now = new Date()) {
  return events.filter((event) => !isUpcomingEvent(event, now));
}

export function getFeaturedEvents(now = new Date()) {
  return getUpcomingEvents(now).filter((event) => event.featured);
}

export function getEventsByCategory(category: string) {
  return events.filter((event) => event.category === category);
}

export function getRelatedEvents(event: Event) {
  if (event.relatedEventIds?.length) {
    return event.relatedEventIds
      .map((id) => getEventById(id))
      .filter((item): item is Event => Boolean(item));
  }

  return events.filter(
    (candidate) =>
      candidate.id !== event.id &&
      candidate.category === event.category &&
      Boolean(event.category),
  );
}

export function validateEvents(records: readonly Event[] = events) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const event of records) {
    if (!event.id || !event.title || !event.slug) {
      throw new Error("Every event must have an id, title and slug.");
    }

    if (ids.has(event.id)) throw new Error(`Duplicate event id: ${event.id}`);
    ids.add(event.id);

    if (slugs.has(event.slug)) throw new Error(`Duplicate event slug: ${event.slug}`);
    slugs.add(event.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug)) {
      throw new Error(`Invalid event slug: ${event.slug}`);
    }

    const date = parseEventDate(event.date);
    if (!date) throw new Error(`Invalid event date: ${event.date}`);

    if (event.endDate) {
      const endDate = parseEventDate(event.endDate);
      if (!endDate) throw new Error(`Invalid event endDate: ${event.endDate}`);
      if (endDate < date) throw new Error(`Event endDate is earlier than date: ${event.id}`);
    }
  }

  return true;
}

validateEvents();
