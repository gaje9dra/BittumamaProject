import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { canonicalServices } from "../data/services";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed Services.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function availabilityFor(status: string | undefined): "COMING_SOON" | "AVAILABLE" {
  return status === "Coming Soon" ? "COMING_SOON" : "AVAILABLE";
}

function jsonValue(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

async function main() {
  for (const [index, service] of canonicalServices.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      create: {
        id: service.id,
        slug: service.slug,
        title: service.title,
        category: service.category,
        shortDescription: service.shortDescription,
        order: index,
        need: service.need ?? null,
        focus: service.focus ?? null,
        audience: service.audience ?? null,
        highlights: jsonValue(service.highlights),
        faq: jsonValue(service.faq),
        featured: service.featured ?? false,
        availability: availabilityFor(service.status),
        status: "PUBLISHED",
        seoTitle: service.seo?.title ?? null,
        seoDescription: service.seo?.description ?? null,
        seoImage: service.seo?.image ?? null,
        seoCanonical: service.seo?.canonical ?? null,
        seoNoIndex: service.seo?.noIndex ?? false,
      },
      update: {
        id: service.id,
        title: service.title,
        category: service.category,
        shortDescription: service.shortDescription,
        order: index,
        need: service.need ?? null,
        focus: service.focus ?? null,
        audience: service.audience ?? null,
        highlights: jsonValue(service.highlights),
        faq: jsonValue(service.faq),
        featured: service.featured ?? false,
        availability: availabilityFor(service.status),
        status: "PUBLISHED",
        seoTitle: service.seo?.title ?? null,
        seoDescription: service.seo?.description ?? null,
        seoImage: service.seo?.image ?? null,
        seoCanonical: service.seo?.canonical ?? null,
        seoNoIndex: service.seo?.noIndex ?? false,
      },
    });
  }

  console.log(`Seeded ${canonicalServices.length} canonical Services.`);
}

main()
  .catch((error) => {
    console.error("Service seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
