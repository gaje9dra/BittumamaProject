import "server-only";

import type { Event as PrismaEvent } from "@/generated/prisma/client";
import type {
  Event,
  EventFormat,
  EventRegistrationStatus,
} from "@/data/events";
import { prisma } from "@/lib/db/prisma";

type EventWithRelations = PrismaEvent & {
  researchLinks: Array<{ researchId: string }>;
  serviceLinks: Array<{ serviceId: string }>;
  relatedFrom: Array<{ targetEventId: string }>;
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item): item is string => typeof item === "string")) return undefined;
  return value;
}

function toDomainEvent(record: EventWithRelations): Event {
  const audience = asStringArray(record.audience);
  const format: EventFormat | undefined =
    record.format === "ONLINE" ? "Online" :
    record.format === "IN_PERSON" ? "In Person" :
    record.format === "HYBRID" ? "Hybrid" : undefined;
  const registrationStatus: EventRegistrationStatus | undefined =
    record.registrationStatus === "REGISTRATION_OPEN" ? "Registration Open" :
    record.registrationStatus === "REGISTRATION_CLOSED" ? "Registration Closed" :
    record.registrationStatus === "COMING_SOON" ? "Coming Soon" :
    record.registrationStatus === "COMPLETED" ? "Completed" : undefined;

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    date: record.date.toISOString().slice(0, 10),
    ...(record.endDate ? { endDate: record.endDate.toISOString().slice(0, 10) } : {}),
    ...(record.time ? { time: record.time } : {}),
    category: record.category,
    ...(record.location ? { location: record.location } : {}),
    ...(format ? { format } : {}),
    shortDescription: record.shortDescription,
    ...(record.description ? { description: record.description } : {}),
    ...(audience?.length ? { audience } : {}),
    ...(record.speakerId ? { speakerId: record.speakerId } : {}),
    ...(record.speakerRole ? { speakerRole: record.speakerRole } : {}),
    ...(record.image ? { image: record.image } : {}),
    ...(record.registrationLabel ? { registrationLabel: record.registrationLabel } : {}),
    ...(record.registrationHref ? { registrationHref: record.registrationHref } : {}),
    ...(registrationStatus ? { registrationStatus } : {}),
    ...(record.featured ? { featured: true } : {}),
    ...(record.relatedFrom.length ? { relatedEventIds: record.relatedFrom.map((item) => item.targetEventId) } : {}),
    ...(record.researchLinks.length ? { relatedResearchIds: record.researchLinks.map((item) => item.researchId) } : {}),
    ...(record.serviceLinks.length ? { relatedServiceIds: record.serviceLinks.map((item) => item.serviceId) } : {}),
    ...(record.seoTitle || record.seoDescription || record.seoImage
      ? {
          seo: {
            ...(record.seoTitle ? { title: record.seoTitle } : {}),
            ...(record.seoDescription ? { description: record.seoDescription } : {}),
            ...(record.seoImage ? { image: record.seoImage } : {}),
          },
        }
      : {}),
  };
}

async function runEventQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Workshop/Event database query failed:", error);
    }
    throw new Error("Unable to load Workshops & Events from the database.");
  }
}

const relationInclude = {
  researchLinks: { select: { researchId: true } },
  serviceLinks: { select: { serviceId: true } },
  relatedFrom: { select: { targetEventId: true } },
} as const;

export async function getPublishedEvents(): Promise<Event[]> {
  const records = await runEventQuery(() =>
    prisma.client.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: relationInclude,
    }),
  );
  return records.map(toDomainEvent);
}

export async function getPublishedEventById(id: string): Promise<Event | undefined> {
  const record = await runEventQuery(() =>
    prisma.client.event.findFirst({
      where: { id, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainEvent(record) : undefined;
}

export async function getPublishedEventBySlug(slug: string): Promise<Event | undefined> {
  const record = await runEventQuery(() =>
    prisma.client.event.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainEvent(record) : undefined;
}

export async function getPublishedEventCategories(): Promise<string[]> {
  const events = await getPublishedEvents();
  return Array.from(new Set(events.map((event) => event.category).filter(Boolean)));
}

function parseEventDate(value: string) {
  const parsed = new Date(value.includes("T") ? value : value + "T23:59:59");
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function isUpcomingEvent(event: Event, now = new Date()) {
  const end = event.endDate ? parseEventDate(event.endDate) : parseEventDate(event.date);
  return end ? end >= now : false;
}

export async function getUpcomingEvents(now = new Date()): Promise<Event[]> {
  return (await getPublishedEvents()).filter((event) => isUpcomingEvent(event, now));
}

export async function getPastEvents(now = new Date()): Promise<Event[]> {
  return (await getPublishedEvents()).filter((event) => !isUpcomingEvent(event, now));
}

export async function getFeaturedEvents(now = new Date()): Promise<Event[]> {
  return (await getUpcomingEvents(now)).filter((event) => event.featured);
}

export async function getRelatedEvents(event: Event): Promise<Event[]> {
  if (event.relatedEventIds?.length) {
    const records = await Promise.all(
      event.relatedEventIds.map((id) => getPublishedEventById(id)),
    );
    return records.filter((item): item is Event => Boolean(item));
  }

  return (await getPublishedEvents()).filter(
    (candidate) =>
      candidate.id !== event.id &&
      candidate.category === event.category &&
      Boolean(event.category),
  );
}
