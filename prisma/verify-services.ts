import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalServices } from "../data/services";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to verify Services.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function normalizeJson(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

function expectedAvailability(status: string | undefined) {
  return status === "Coming Soon" ? "COMING_SOON" : "AVAILABLE";
}

async function main() {
  const records = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const expectedBySlug = new Map(canonicalServices.map((service, index) => [service.slug, { service, index }]));
  const errors: string[] = [];

  if (records.length !== canonicalServices.length) {
    errors.push(`Expected ${canonicalServices.length} Services, found ${records.length}.`);
  }

  for (const record of records) {
    const expected = expectedBySlug.get(record.slug);

    if (!expected) {
      errors.push(`Unexpected Service record: ${record.slug}`);
      continue;
    }

    const { service, index } = expected;

    const checks: Array<[string, unknown, unknown]> = [
      ["id", record.id, service.id],
      ["title", record.title, service.title],
      ["category", record.category, service.category],
      ["shortDescription", record.shortDescription, service.shortDescription],
      ["order", record.order, index],
      ["need", record.need, service.need ?? null],
      ["focus", record.focus, service.focus ?? null],
      ["audience", record.audience, service.audience ?? null],
      ["highlights", normalizeJson(record.highlights), normalizeJson(service.highlights)],
      ["faq", normalizeJson(record.faq), normalizeJson(service.faq)],
      ["featured", record.featured, service.featured ?? false],
      ["availability", record.availability, expectedAvailability(service.status)],
      ["status", record.status, "PUBLISHED"],
      ["seoTitle", record.seoTitle, service.seo?.title ?? null],
      ["seoDescription", record.seoDescription, service.seo?.description ?? null],
      ["seoImage", record.seoImage, service.seo?.image ?? null],
      ["seoCanonical", record.seoCanonical, service.seo?.canonical ?? null],
      ["seoNoIndex", record.seoNoIndex, service.seo?.noIndex ?? false],
    ];

    for (const [field, actual, expectedValue] of checks) {
      if (actual !== expectedValue) {
        errors.push(`${service.slug}: ${field} mismatch (database=${JSON.stringify(actual)}, canonical=${JSON.stringify(expectedValue)})`);
      }
    }

    if (record.slug !== service.slug) {
      errors.push(`${service.id}: slug mismatch.`);
    }
  }

  const duplicateIds = await prisma.service.groupBy({
    by: ["id"],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } },
  });
  const duplicateSlugs = await prisma.service.groupBy({
    by: ["slug"],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  if (duplicateIds.length) errors.push("Duplicate Service IDs detected.");
  if (duplicateSlugs.length) errors.push("Duplicate Service slugs detected.");

  if (errors.length) {
    console.error("SERVICE INTEGRITY FAILED");
    for (const error of errors) console.error(" - " + error);
    process.exitCode = 1;
    return;
  }

  console.log(`SERVICE INTEGRITY PASSED — ${records.length} canonical Services match.`);
}

main()
  .catch((error) => {
    console.error("Service verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
