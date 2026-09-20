import "dotenv/config";

import { Prisma } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { canonicalEvents, validateEvents } from "../data/events";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed Workshops & Events.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function jsonValue(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

async function resolveExpertId(reference: string) {
  const expert =
    (await prisma.expert.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.expert.findUnique({ where: { slug: reference }, select: { id: true } }));
  if (!expert) throw new Error(`Workshop/Event references missing Expert: ${reference}`);
  return expert.id;
}

async function resolveResearchId(reference: string) {
  const research =
    (await prisma.researchItem.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.researchItem.findUnique({ where: { slug: reference }, select: { id: true } }));
  if (!research) throw new Error(`Workshop/Event relationship references missing Research: ${reference}`);
  return research.id;
}

async function resolveServiceId(reference: string) {
  const service =
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));
  if (!service) throw new Error(`Workshop/Event relationship references missing Service: ${reference}`);
  return service.id;
}

async function resolveEventId(reference: string) {
  const event =
    (await prisma.event.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.event.findUnique({ where: { slug: reference }, select: { id: true } }));
  if (!event) throw new Error(`Workshop/Event relationship references missing Event: ${reference}`);
  return event.id;
}

function toDate(value: string) {
  const parsed = new Date(value.includes("T") ? value : value + "T00:00:00.000Z");
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid event date: ${value}`);
  return parsed;
}

async function main() {
  validateEvents();

  for (const [index, event] of canonicalEvents.entries()) {
    const speakerId = event.speakerId || event.speakerSlug
      ? await resolveExpertId(event.speakerId ?? event.speakerSlug!)
      : null;

    const researchIds = [];
    for (const reference of event.relatedResearchIds ?? []) {
      researchIds.push(await resolveResearchId(reference));
    }

    const serviceIds = [];
    for (const reference of event.relatedServiceIds ?? []) {
      serviceIds.push(await resolveServiceId(reference));
    }

    const relatedEventIds = [];
    for (const reference of event.relatedEventIds ?? []) {
      relatedEventIds.push(await resolveEventId(reference));
    }

    const record = await prisma.event.upsert({
      where: { slug: event.slug },
      create: {
        id: event.id,
        slug: event.slug,
        title: event.title,
        order: index,
        date: toDate(event.date),
        endDate: event.endDate ? toDate(event.endDate) : null,
        time: event.time ?? null,
        category: event.category,
        location: event.location ?? null,
        format: event.format === "Online" ? "ONLINE" : event.format === "In Person" ? "IN_PERSON" : event.format === "Hybrid" ? "HYBRID" : null,
        shortDescription: event.shortDescription,
        description: event.description ?? null,
        audience: jsonValue(event.audience),
        speakerId,
        speakerSlug: event.speakerSlug ?? null,
        speakerRole: event.speakerRole ?? null,
        image: event.image ?? null,
        registrationLabel: event.registrationLabel ?? null,
        registrationHref: event.registrationHref ?? null,
        registrationStatus: event.registrationStatus === "Registration Open" ? "REGISTRATION_OPEN" : event.registrationStatus === "Registration Closed" ? "REGISTRATION_CLOSED" : event.registrationStatus === "Coming Soon" ? "COMING_SOON" : event.registrationStatus === "Completed" ? "COMPLETED" : null,
        featured: event.featured ?? false,
        status: "PUBLISHED",
        seoTitle: event.seo?.title ?? null,
        seoDescription: event.seo?.description ?? null,
        seoImage: event.seo?.image ?? null,
      },
      update: {
        id: event.id,
        title: event.title,
        order: index,
        date: toDate(event.date),
        endDate: event.endDate ? toDate(event.endDate) : null,
        time: event.time ?? null,
        category: event.category,
        location: event.location ?? null,
        format: event.format === "Online" ? "ONLINE" : event.format === "In Person" ? "IN_PERSON" : event.format === "Hybrid" ? "HYBRID" : null,
        shortDescription: event.shortDescription,
        description: event.description ?? null,
        audience: jsonValue(event.audience),
        speakerId,
        speakerSlug: event.speakerSlug ?? null,
        speakerRole: event.speakerRole ?? null,
        image: event.image ?? null,
        registrationLabel: event.registrationLabel ?? null,
        registrationHref: event.registrationHref ?? null,
        registrationStatus: event.registrationStatus === "Registration Open" ? "REGISTRATION_OPEN" : event.registrationStatus === "Registration Closed" ? "REGISTRATION_CLOSED" : event.registrationStatus === "Coming Soon" ? "COMING_SOON" : event.registrationStatus === "Completed" ? "COMPLETED" : null,
        featured: event.featured ?? false,
        status: "PUBLISHED",
        seoTitle: event.seo?.title ?? null,
        seoDescription: event.seo?.description ?? null,
        seoImage: event.seo?.image ?? null,
      },
    });

    await prisma.workshopResearch.deleteMany({ where: { eventId: record.id } });
    if (researchIds.length) await prisma.workshopResearch.createMany({ data: researchIds.map((researchId) => ({ eventId: record.id, researchId })), skipDuplicates: true });

    await prisma.workshopService.deleteMany({ where: { eventId: record.id } });
    if (serviceIds.length) await prisma.workshopService.createMany({ data: serviceIds.map((serviceId) => ({ eventId: record.id, serviceId })), skipDuplicates: true });

    await prisma.eventRelation.deleteMany({ where: { sourceEventId: record.id } });
    if (relatedEventIds.length) await prisma.eventRelation.createMany({ data: relatedEventIds.map((targetEventId) => ({ sourceEventId: record.id, targetEventId })), skipDuplicates: true });
  }

  console.log(`Seeded ${canonicalEvents.length} canonical Workshops/Events.`);
}

main()
  .catch((error) => {
    console.error("Workshop/Event seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
