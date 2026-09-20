import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalResearchEntries, validateResearch } from "../data/research";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to verify Research.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function normalizeJson(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

function expectedAvailability(status: string | undefined) {
  return status === "Coming Soon" ? "COMING_SOON" : "AVAILABLE";
}

function expectedStatus() {
  return "PUBLISHED";
}

async function resolveServiceId(reference: string) {
  const service =
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));
  return service?.id;
}

async function main() {\n  validateResearch();
  const records = await prisma.researchItem.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: { serviceLinks: { select: { serviceId: true } } },
  });
  const expectedBySlug = new Map(
    canonicalResearchEntries.map((research, index) => [research.slug, { research, index }]),
  );
  const errors: string[] = [];

  if (records.length !== canonicalResearchEntries.length) {
    errors.push(`Expected ${canonicalResearchEntries.length} Research records, found ${records.length}.`);
  }

  for (const record of records) {
    const expected = expectedBySlug.get(record.slug);
    if (!expected) {
      errors.push(`Unexpected Research record: ${record.slug}`);
      continue;
    }

    const { research, index } = expected;
    const checks: Array<[string, unknown, unknown]> = [
      ["id", record.id, research.id],
      ["slug", record.slug, research.slug],
      ["title", record.title, research.title],
      ["category", record.category, research.category],
      ["shortDescription", record.shortDescription, research.shortDescription],
      ["order", record.order, index],
      ["summary", record.summary, research.summary ?? null],
      ["date", record.date?.toISOString() ?? null, research.date ? new Date(research.date).toISOString() : null],
      ["status", record.status, expectedStatus()],
      ["availability", record.availability, expectedAvailability(research.status)],
      ["type", record.type, research.type ?? null],
      ["topic", record.topic, research.topic ?? null],
      ["image", record.image, research.image ?? null],
      ["featured", record.featured, research.featured ?? false],
      ["tags", normalizeJson(record.tags), normalizeJson(research.tags)],
      ["highlights", normalizeJson(record.highlights), normalizeJson(research.highlights)],
      ["audience", normalizeJson(record.audience), normalizeJson(research.audience)],
      ["scope", normalizeJson(record.scope), normalizeJson(research.scope)],
      ["topics", normalizeJson(record.topics), normalizeJson(research.topics)],
      ["sections", normalizeJson(record.sections), normalizeJson(research.sections)],
      ["methodology", normalizeJson(record.methodology), normalizeJson(research.methodology)],
      ["seoTitle", record.seoTitle, research.seo?.title ?? null],
      ["seoDescription", record.seoDescription, research.seo?.description ?? null],
      ["seoImage", record.seoImage, research.seo?.image ?? null],
      ["seoCanonical", record.seoCanonical, research.seo?.canonical ?? null],
      ["seoNoIndex", record.seoNoIndex, research.seo?.noIndex ?? false],
    ];

    for (const [field, actual, expectedValue] of checks) {
      if (actual !== expectedValue) {
        errors.push(`${research.slug}: ${field} mismatch (database=${JSON.stringify(actual)}, canonical=${JSON.stringify(expectedValue)})`);
      }
    }

    const expectedServiceIds = [];
    for (const reference of research.relatedServiceIds ?? []) {
      const serviceId = await resolveServiceId(reference);
      if (!serviceId) {
        errors.push(`${research.slug}: related Service does not exist: ${reference}`);
      } else {
        expectedServiceIds.push(serviceId);
      }
    }

    const actualServiceIds = record.serviceLinks.map((link) => link.serviceId).sort();
    expectedServiceIds.sort();
    if (JSON.stringify(actualServiceIds) !== JSON.stringify(expectedServiceIds)) {
      errors.push(`${research.slug}: Research ↔ Service relationship mismatch.`);
    }
  }

  const duplicateIds = await prisma.researchItem.groupBy({
    by: ["id"],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } },
  });
  const duplicateSlugs = await prisma.researchItem.groupBy({
    by: ["slug"],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  if (duplicateIds.length) errors.push("Duplicate Research IDs detected.");
  if (duplicateSlugs.length) errors.push("Duplicate Research slugs detected.");

  if (errors.length) {
    console.error("RESEARCH INTEGRITY FAILED");
    for (const error of errors) console.error(" - " + error);
    process.exitCode = 1;
    return;
  }

  console.log(`RESEARCH INTEGRITY PASSED — ${records.length} canonical Research records match.`);
}

main()
  .catch((error) => {
    console.error("Research verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
