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
  registrationEnabled?: boolean;
  registrationCapacity?: number | null;
  registrationDeadline?: string;
  registrationMode?: "ANONYMOUS_ALLOWED" | "AUTHENTICATED_ONLY";
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

function parseEventDate(value: string) {
  const parsed = new Date(value.includes("T") ? value : value + "T23:59:59");
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

// Migration-only Phase 7.6 canonical snapshot.
// Production Workshop/Event reads come from PostgreSQL via lib/events/repository.ts.
export const canonicalEvents: Event[] = [];

export function validateEvents(records: readonly Event[] = canonicalEvents) {
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
