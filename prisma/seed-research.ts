import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalResearchEntries, validateResearch } from "../data/research";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed Research.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function availabilityFor(status: string | undefined): "AVAILABLE" | "COMING_SOON" {
  return status === "Coming Soon" ? "COMING_SOON" : "AVAILABLE";
}

function dateFor(value: string | undefined, id: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid Research date for ${id}: ${value}`);
  }
  return date;
}

async function resolveServiceId(reference: string) {
  const service =
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));

  if (!service) {
    throw new Error(`Research relationship references missing Service: ${reference}`);
  }

  return service.id;
}

async function main() {\n  validateResearch();
  for (const [index, research] of canonicalResearchEntries.entries()) {
    const serviceIds = [];
    for (const reference of research.relatedServiceIds ?? []) {
      serviceIds.push(await resolveServiceId(reference));
    }

    const record = await prisma.researchItem.upsert({
      where: { slug: research.slug },
      create: {
        id: research.id,
        slug: research.slug,
        title: research.title,
        category: research.category,
        shortDescription: research.shortDescription,
        order: index,
        summary: research.summary ?? null,
        date: dateFor(research.date, research.id),
        status: "PUBLISHED",
        availability: availabilityFor(research.status),
        type: research.type ?? null,
        topic: research.topic ?? null,
        image: research.image ?? null,
        featured: research.featured ?? false,
        tags: research.tags ?? null,
        highlights: research.highlights ?? null,
        audience: research.audience ?? null,
        scope: research.scope ?? null,
        topics: research.topics ?? null,
        sections: research.sections ?? null,
        methodology: research.methodology ?? null,
        seoTitle: research.seo?.title ?? null,
        seoDescription: research.seo?.description ?? null,
        seoImage: research.seo?.image ?? null,
        seoCanonical: research.seo?.canonical ?? null,
        seoNoIndex: research.seo?.noIndex ?? false,
      },
      update: {
        id: research.id,
        title: research.title,
        category: research.category,
        shortDescription: research.shortDescription,
        order: index,
        summary: research.summary ?? null,
        date: dateFor(research.date, research.id),
        status: "PUBLISHED",
        availability: availabilityFor(research.status),
        type: research.type ?? null,
        topic: research.topic ?? null,
        image: research.image ?? null,
        featured: research.featured ?? false,
        tags: research.tags ?? null,
        highlights: research.highlights ?? null,
        audience: research.audience ?? null,
        scope: research.scope ?? null,
        topics: research.topics ?? null,
        sections: research.sections ?? null,
        methodology: research.methodology ?? null,
        seoTitle: research.seo?.title ?? null,
        seoDescription: research.seo?.description ?? null,
        seoImage: research.seo?.image ?? null,
        seoCanonical: research.seo?.canonical ?? null,
        seoNoIndex: research.seo?.noIndex ?? false,
      },
    });

    await prisma.researchService.deleteMany({ where: { researchId: record.id } });
    if (serviceIds.length) {
      await prisma.researchService.createMany({
        data: serviceIds.map((serviceId) => ({ researchId: record.id, serviceId })),
        skipDuplicates: true,
      });
    }
  }

  console.log(`Seeded ${canonicalResearchEntries.length} canonical Research records.`);
}

main()
  .catch((error) => {
    console.error("Research seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
