import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalServices, getServiceHref } from "../data/services";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify Services.");
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to verify Services.");

  const records = await prisma.service.findMany({
    where: { slug: { in: canonicalServices.map((service) => service.slug) } },
    orderBy: { order: "asc" },
  });
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const errors: string[] = [];

  if (records.length !== canonicalServices.length) {
    errors.push(`Expected all 28 requested Services, found ${records.length} matching records.`);
  }

  for (const [index, service] of canonicalServices.entries()) {
    const record = bySlug.get(service.slug);
    if (!record) {
      errors.push(`Missing Service: ${service.title} (${service.slug})`);
      continue;
    }

    const checks: Array<[string, unknown, unknown]> = [
      ["title", record.title, service.title],
      ["category", record.category, service.category],
      ["shortDescription", record.shortDescription, service.shortDescription],
      ["order", record.order, index],
      ["need", record.need, service.need ?? null],
      ["focus", record.focus, service.focus ?? null],
      ["audience", record.audience, service.audience ?? null],
      ["status", record.status, "PUBLISHED"],
      ["availability", record.availability, "AVAILABLE"],
      ["seoTitle", record.seoTitle, service.seo?.title ?? null],
      ["seoDescription", record.seoDescription, service.seo?.description ?? null],
      ["seoCanonical", record.seoCanonical, service.seo?.canonical ?? null],
      ["seoNoIndex", record.seoNoIndex, service.seo?.noIndex ?? false],
    ];

    for (const [field, actual, expected] of checks) {
      if (actual !== expected) {
        errors.push(`${service.slug}: ${field} mismatch (database=${JSON.stringify(actual)}, canonical=${JSON.stringify(expected)})`);
      }
    }

    if (record.slug !== service.slug) errors.push(`${service.title}: slug mismatch.`);

    const publicService = await prisma.service.findFirst({ where: { slug: service.slug, status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] }, select: { id: true, slug: true, title: true } });
    if (!publicService || publicService.slug !== service.slug || publicService.title !== service.title) errors.push(`${service.title}: public route data is missing or mismatched.`);
    if (getServiceHref(service) !== "/services/" + service.slug) errors.push(`${service.title}: canonical route mismatch.`);
  }

  const duplicateSlugs = await prisma.service.groupBy({
    by: ["slug"],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });
  if (duplicateSlugs.length) errors.push("Duplicate Service slugs detected.");

  const categoryCounts = new Map<string, number>();
  for (const service of canonicalServices) categoryCounts.set(service.category, (categoryCounts.get(service.category) ?? 0) + 1);
  for (const [category, expected] of categoryCounts) {
    const actual = records.filter((record) => record.category === category).length;
    if (actual !== expected) errors.push(`${category}: expected ${expected}, found ${actual}.`);
  }

  if (errors.length) {
    console.error("SERVICE INVENTORY FAILED");
    for (const error of errors) console.error(" - " + error);
    process.exitCode = 1;
    return;
  }

  console.log("SERVICE INVENTORY PASSED — all 28 requested Services are canonical and published.");
}

main()
  .catch((error) => { console.error("Service verification failed:", error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
