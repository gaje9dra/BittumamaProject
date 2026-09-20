import "dotenv/config";

import { Prisma } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { canonicalEvents, validateEvents } from "../data/events";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify Workshops & Events.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function jsonValue(value: unknown) {
  return value === undefined ? Prisma.JsonNull : value;
}

function toDate(value: string) {
  return new Date(value.includes("T") ? value : value + "T00:00:00.000Z");
}

async function main() {
  validateEvents();
  const records = await prisma.event.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      researchLinks: { select: { researchId: true } },
      serviceLinks: { select: { serviceId: true } },
      relatedFrom: { select: { targetEventId: true } },
    },
  });

  if (records.length !== canonicalEvents.length) {
    throw new Error(`EVENT INTEGRITY FAILED — expected ${canonicalEvents.length}, found ${records.length}.`);
  }

  const expectedIds = new Set(canonicalEvents.map((event) => event.id));
  for (const record of records) {
    const expected = canonicalEvents.find((event) => event.id === record.id);
    if (!expected) throw new Error(`Unexpected Event record: ${record.id}`);
    if (record.slug !== expected.slug) throw new Error(`Event slug mismatch: ${record.id}`);
    if (record.title !== expected.title) throw new Error(`Event title mismatch: ${record.id}`);
    if (record.order !== canonicalEvents.findIndex((event) => event.id === record.id)) throw new Error(`Event order mismatch: ${record.id}`);
    if (record.date.getTime() !== toDate(expected.date).getTime()) throw new Error(`Event date mismatch: ${record.id}`);
    if ((record.endDate?.getTime() ?? null) !== (expected.endDate ? toDate(expected.endDate).getTime() : null)) throw new Error(`Event endDate mismatch: ${record.id}`);
    if (record.shortDescription !== expected.shortDescription) throw new Error(`Event shortDescription mismatch: ${record.id}`);
    if (record.category !== expected.category) throw new Error(`Event category mismatch: ${record.id}`);
    if (record.status !== "PUBLISHED") throw new Error(`Event publication status mismatch: ${record.id}`);
    const expectedResearch = new Set(expected.relatedResearchIds ?? []);
    const expectedServices = new Set(expected.relatedServiceIds ?? []);
    const expectedRelated = new Set(expected.relatedEventIds ?? []);
    if (record.researchLinks.length !== expectedResearch.size || record.serviceLinks.length !== expectedServices.size || record.relatedFrom.length !== expectedRelated.size) {
      throw new Error(`Event relationship count mismatch: ${record.id}`);
    }
  }

  const duplicateIds = records.map((record) => record.id).filter((id, index, all) => all.indexOf(id) !== index);
  if (duplicateIds.length) throw new Error(`Duplicate Event ids: ${duplicateIds.join(", ")}`);
  if (new Set(records.map((record) => record.slug)).size !== records.length) throw new Error("Duplicate Event slugs detected.");

  const unexpected = records.filter((record) => !expectedIds.has(record.id));
  if (unexpected.length) throw new Error("Unexpected Workshop/Event records detected.");

  console.log(`EVENT INTEGRITY PASSED — ${records.length} canonical Workshops/Events match.`);
}

main()
  .catch((error) => {
    console.error("Workshop/Event verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
