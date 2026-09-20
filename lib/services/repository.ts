import "server-only";

import type { Service as PrismaService } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
  Service,
  ServiceFaq,
  ServiceHighlight,
  ServiceSeo,
} from "@/data/services";

function asHighlights(value: PrismaService["highlights"]): ServiceHighlight[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.filter(
    (item): item is ServiceHighlight =>
      typeof item === "object" &&
      item !== null &&
      typeof item.title === "string" &&
      typeof item.description === "string",
  );
}

function asFaq(value: PrismaService["faq"]): ServiceFaq[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.filter(
    (item): item is ServiceFaq =>
      typeof item === "object" &&
      item !== null &&
      typeof item.question === "string" &&
      typeof item.answer === "string",
  );
}

function toDomainService(record: PrismaService): Service {
  const seo: ServiceSeo | undefined =
    record.seoTitle ||
    record.seoDescription ||
    record.seoImage ||
    record.seoCanonical ||
    record.seoNoIndex
      ? {
          ...(record.seoTitle ? { title: record.seoTitle } : {}),
          ...(record.seoDescription ? { description: record.seoDescription } : {}),
          ...(record.seoImage ? { image: record.seoImage } : {}),
          ...(record.seoCanonical ? { canonical: record.seoCanonical } : {}),
          ...(record.seoNoIndex ? { noIndex: true } : {}),
        }
      : undefined;

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    category: record.category,
    shortDescription: record.shortDescription,
    ...(record.need ? { need: record.need } : {}),
    ...(record.focus ? { focus: record.focus } : {}),
    ...(record.audience ? { audience: record.audience } : {}),
    ...(asHighlights(record.highlights)?.length
      ? { highlights: asHighlights(record.highlights) }
      : {}),
    ...(asFaq(record.faq)?.length ? { faq: asFaq(record.faq) } : {}),
    ...(record.featured ? { featured: true } : {}),
    ...(record.availability === "COMING_SOON" ? { status: "Coming Soon" } : {}),
    ...(seo ? { seo } : {}),
  };
}

export async function getPublishedServices(): Promise<Service[]> {
  const records = await prisma.client.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  return records.map(toDomainService);
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  const record = await prisma.client.service.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
  });

  return record ? toDomainService(record) : undefined;
}

export async function getPublishedServiceCategories(): Promise<string[]> {
  const records = await prisma.client.service.findMany({
    where: { status: "PUBLISHED" },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  const ordered = await getPublishedServices();
  const orderByCategory = new Map<string, number>();

  for (const [index, service] of ordered.entries()) {
    if (!orderByCategory.has(service.category)) {
      orderByCategory.set(service.category, index);
    }
  }

  return records
    .map((record) => record.category)
    .sort(
      (a, b) =>
        (orderByCategory.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (orderByCategory.get(b) ?? Number.MAX_SAFE_INTEGER),
    );
}

export async function getRelatedPublishedServices(
  service: Service,
): Promise<Service[]> {
  const records = await prisma.client.service.findMany({
    where: {
      status: "PUBLISHED",
      category: service.category,
      NOT: { id: service.id },
    },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  return records.map(toDomainService);
}
