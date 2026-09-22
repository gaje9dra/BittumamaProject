import "server-only";

import type { Service as PrismaService } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
  Service,
  ServiceFaq,
  ServiceHighlight,
  ServiceSeo,
} from "@/data/services";
import { canonicalServiceSlugs, canonicalServices } from "@/data/services";

function getCanonicalFallback(slug: string): Service | undefined {
  if (process.env.NODE_ENV === "production") return undefined;
  return canonicalServices.find((service) => service.slug === slug);
}

async function runServiceQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Service database query failed:", error);
    }
    throw new Error("Unable to load Services from the database.");
  }
}

function asHighlights(value: PrismaService["highlights"]): ServiceHighlight[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.filter(
    (item): item is ServiceHighlight =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).title === "string" &&
      typeof (item as Record<string, unknown>).description === "string",
  );
}

function asFaq(value: PrismaService["faq"]): ServiceFaq[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.filter(
    (item): item is ServiceFaq =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).question === "string" &&
      typeof (item as Record<string, unknown>).answer === "string",
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
  const records = await runServiceQuery(() => prisma.client.service.findMany({
    where: { status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  }));

  return records.map(toDomainService);
}


export async function getRequestedPublishedServices(): Promise<Service[]> {
  const records = await runServiceQuery(() => prisma.client.service.findMany({
    where: {
      slug: { in: [...canonicalServiceSlugs] },
      status: "PUBLISHED",
      OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
    },
  }));

  const order = new Map(canonicalServiceSlugs.map((slug, index) => [slug, index]));
  records.sort((a, b) => (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER));

  if (records.length !== canonicalServiceSlugs.length) {
    const loaded = new Set(records.map((record) => record.slug));
    const missing = canonicalServiceSlugs.filter((slug) => !loaded.has(slug));

    if (process.env.NODE_ENV !== "production") {
      const fallbackBySlug = new Map(
        canonicalServices
          .filter((service) => missing.includes(service.slug))
          .map((service) => [service.slug, service]),
      );

      return canonicalServiceSlugs
        .map((slug) => {
          const record = records.find((item) => item.slug === slug);
          return record ? toDomainService(record) : fallbackBySlug.get(slug);
        })
        .filter((service): service is Service => Boolean(service));
    }

    throw new Error(
      `Canonical Services navigation is incomplete. Missing: ${missing.join(", ")}`,
    );
  }

  return records.map(toDomainService);
}

export async function getPublishedServiceById(
  id: string,
): Promise<Service | undefined> {
  const record = await runServiceQuery(() => prisma.client.service.findFirst({
    where: { id, status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
  }));

  return record ? toDomainService(record) : getCanonicalFallback(id);
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  const record = await runServiceQuery(() => prisma.client.service.findFirst({
    where: {
      slug,
      status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
    },
  }));

  return record ? toDomainService(record) : getCanonicalFallback(slug);
}

export async function getPublishedServiceCategories(): Promise<string[]> {
  const records = await runServiceQuery(() => prisma.client.service.findMany({
    where: { status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  }));

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
  const records = await runServiceQuery(() => prisma.client.service.findMany({
    where: {
      status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
      category: service.category,
      NOT: { id: service.id },
    },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  }));

  return records.map(toDomainService);
}


export async function getPreviewServiceById(id: string): Promise<Service | undefined> {
  const record = await runServiceQuery(() => prisma.client.service.findUnique({ where: { id } }));
  return record ? toDomainService(record) : undefined;
}
