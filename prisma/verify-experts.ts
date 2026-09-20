import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalExperts, validateExperts } from "../data/expertise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify Experts.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function normalizeJson(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

async function resolveServiceId(reference: string) {
  const service =
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));
  return service?.id;
}

async function resolveResearchId(reference: string) {
  const research =
    (await prisma.researchItem.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.researchItem.findUnique({ where: { slug: reference }, select: { id: true } }));
  return research?.id;
}

async function main() {
  validateExperts();

  const records = await prisma.expert.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      serviceLinks: { select: { serviceId: true } },
      researchLinks: { select: { researchId: true } },
    },
  });

  const expectedBySlug = new Map(canonicalExperts.map((expert, index) => [expert.slug, { expert, index }]));
  const errors: string[] = [];

  if (records.length !== canonicalExperts.length) {
    errors.push(`Expected ${canonicalExperts.length} Experts, found ${records.length}.`);
  }

  for (const record of records) {
    const expected = expectedBySlug.get(record.slug);
    if (!expected) {
      errors.push(`Unexpected Expert record: ${record.slug}`);
      continue;
    }

    const { expert, index } = expected;
    const checks: Array<[string, unknown, unknown]> = [
      ["id", record.id, expert.id],
      ["slug", record.slug, expert.slug],
      ["name", record.name, expert.name],
      ["order", record.order, index],
      ["role", record.role, expert.role ?? null],
      ["discipline", record.discipline, expert.discipline ?? null],
      ["shortBio", record.shortBio, expert.shortBio ?? null],
      ["bio", record.bio, expert.bio ?? null],
      ["image", record.image, expert.image ?? null],
      ["expertise", normalizeJson(record.expertise), normalizeJson(expert.expertise)],
      ["qualifications", normalizeJson(record.qualifications), normalizeJson(expert.qualifications)],
      ["researchInterests", normalizeJson(record.researchInterests), normalizeJson(expert.researchInterests)],
      ["featured", record.featured, expert.featured ?? false],
      ["status", record.status, "PUBLISHED"],
      ["seoTitle", record.seoTitle, expert.seo?.title ?? null],
      ["seoDescription", record.seoDescription, expert.seo?.description ?? null],
      ["seoImage", record.seoImage, expert.seo?.image ?? null],
      ["seoCanonical", record.seoCanonical, expert.seo?.canonical ?? null],
      ["seoNoIndex", record.seoNoIndex, expert.seo?.noIndex ?? false],
    ];

    for (const [field, actual, expectedValue] of checks) {
      if (actual !== expectedValue) {
        errors.push(`${expert.slug}: ${field} mismatch (database=${JSON.stringify(actual)}, canonical=${JSON.stringify(expectedValue)})`);
      }
    }

    const expectedServiceIds = [];
    for (const reference of expert.serviceIds ?? []) {
      const id = await resolveServiceId(reference);
      if (!id) errors.push(`${expert.slug}: missing Service relationship target: ${reference}`);
      else expectedServiceIds.push(id);
    }
    expectedServiceIds.sort();

    const actualServiceIds = record.serviceLinks.map((link) => link.serviceId).sort();
    if (JSON.stringify(actualServiceIds) !== JSON.stringify(expectedServiceIds)) {
      errors.push(`${expert.slug}: Expert ↔ Service relationship mismatch.`);
    }

    const expectedResearchIds = [];
    for (const reference of expert.researchIds ?? []) {
      const id = await resolveResearchId(reference);
      if (!id) errors.push(`${expert.slug}: missing Research relationship target: ${reference}`);
      else expectedResearchIds.push(id);
    }
    expectedResearchIds.sort();

    const actualResearchIds = record.researchLinks.map((link) => link.researchId).sort();
    if (JSON.stringify(actualResearchIds) !== JSON.stringify(expectedResearchIds)) {
      errors.push(`${expert.slug}: Expert ↔ Research relationship mismatch.`);
    }
  }

  const duplicateIds = await prisma.expert.groupBy({
    by: ["id"],
    _count: { id: true },
    having: { id: { _count: { gt: 1 } } },
  });
  const duplicateSlugs = await prisma.expert.groupBy({
    by: ["slug"],
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  if (duplicateIds.length) errors.push("Duplicate Expert IDs detected.");
  if (duplicateSlugs.length) errors.push("Duplicate Expert slugs detected.");

  if (errors.length) {
    console.error("EXPERT INTEGRITY FAILED");
    for (const error of errors) console.error(" - " + error);
    process.exitCode = 1;
    return;
  }

  console.log(`EXPERT INTEGRITY PASSED — ${records.length} canonical Experts match.`);
}

main()
  .catch((error) => {
    console.error("Expert verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
