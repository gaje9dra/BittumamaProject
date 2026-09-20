import "dotenv/config";

import { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { canonicalExperts, validateExperts } from "../data/expertise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed Experts.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function jsonValue(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

async function resolveServiceId(reference: string) {
  const service =
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));

  if (!service) {
    throw new Error(`Expert relationship references missing Service: ${reference}`);
  }

  return service.id;
}

async function resolveResearchId(reference: string) {
  const research =
    (await prisma.researchItem.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.researchItem.findUnique({ where: { slug: reference }, select: { id: true } }));

  if (!research) {
    throw new Error(`Expert relationship references missing Research: ${reference}`);
  }

  return research.id;
}

async function main() {
  validateExperts();

  for (const [index, expert] of canonicalExperts.entries()) {
    const serviceIds = [];
    for (const reference of expert.serviceIds ?? []) {
      serviceIds.push(await resolveServiceId(reference));
    }

    const researchIds = [];
    for (const reference of expert.researchIds ?? []) {
      researchIds.push(await resolveResearchId(reference));
    }

    const record = await prisma.expert.upsert({
      where: { slug: expert.slug },
      create: {
        id: expert.id,
        slug: expert.slug,
        name: expert.name,
        order: index,
        role: expert.role ?? null,
        discipline: expert.discipline ?? null,
        shortBio: expert.shortBio ?? null,
        bio: expert.bio ?? null,
        image: expert.image ?? null,
        expertise: jsonValue(expert.expertise),
        qualifications: jsonValue(expert.qualifications),
        researchInterests: jsonValue(expert.researchInterests),
        featured: expert.featured ?? false,
        status: "PUBLISHED",
        seoTitle: expert.seo?.title ?? null,
        seoDescription: expert.seo?.description ?? null,
        seoImage: expert.seo?.image ?? null,
        seoCanonical: expert.seo?.canonical ?? null,
        seoNoIndex: expert.seo?.noIndex ?? false,
      },
      update: {
        id: expert.id,
        name: expert.name,
        order: index,
        role: expert.role ?? null,
        discipline: expert.discipline ?? null,
        shortBio: expert.shortBio ?? null,
        bio: expert.bio ?? null,
        image: expert.image ?? null,
        expertise: jsonValue(expert.expertise),
        qualifications: jsonValue(expert.qualifications),
        researchInterests: jsonValue(expert.researchInterests),
        featured: expert.featured ?? false,
        status: "PUBLISHED",
        seoTitle: expert.seo?.title ?? null,
        seoDescription: expert.seo?.description ?? null,
        seoImage: expert.seo?.image ?? null,
        seoCanonical: expert.seo?.canonical ?? null,
        seoNoIndex: expert.seo?.noIndex ?? false,
      },
    });

    await prisma.expertService.deleteMany({ where: { expertId: record.id } });
    if (serviceIds.length) {
      await prisma.expertService.createMany({
        data: serviceIds.map((serviceId) => ({ expertId: record.id, serviceId })),
        skipDuplicates: true,
      });
    }

    await prisma.expertResearch.deleteMany({ where: { expertId: record.id } });
    if (researchIds.length) {
      await prisma.expertResearch.createMany({
        data: researchIds.map((researchId) => ({ expertId: record.id, researchId })),
        skipDuplicates: true,
      });
    }
  }

  console.log(`Seeded ${canonicalExperts.length} canonical Experts.`);
}

main()
  .catch((error) => {
    console.error("Expert seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
