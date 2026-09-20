import "server-only";

import type { Expert as PrismaExpert } from "@/generated/prisma/client";
import type { Expert, ExpertSeo } from "@/data/expertise";
import { prisma } from "@/lib/db/prisma";

type PrismaExpertWithRelations = PrismaExpert & {
  researchLinks: Array<{ researchId: string }>;
  serviceLinks: Array<{ serviceId: string }>;
  articleLinks: Array<{ articleId: string }>;
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item): item is string => typeof item === "string")) return undefined;
  return value;
}

function asSeo(record: PrismaExpert): ExpertSeo | undefined {
  if (!record.seoTitle && !record.seoDescription && !record.seoImage && !record.seoCanonical && !record.seoNoIndex) {
    return undefined;
  }
  return {
    ...(record.seoTitle ? { title: record.seoTitle } : {}),
    ...(record.seoDescription ? { description: record.seoDescription } : {}),
    ...(record.seoImage ? { image: record.seoImage } : {}),
    ...(record.seoCanonical ? { canonical: record.seoCanonical } : {}),
    ...(record.seoNoIndex ? { noIndex: true } : {}),
  };
}

function toDomainExpert(record: PrismaExpertWithRelations): Expert {
  const expertise = asStringArray(record.expertise);
  const qualifications = asStringArray(record.qualifications);
  const researchInterests = asStringArray(record.researchInterests);
  const seo = asSeo(record);

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    ...(record.role ? { role: record.role } : {}),
    ...(record.discipline ? { discipline: record.discipline } : {}),
    ...(record.shortBio ? { shortBio: record.shortBio } : {}),
    ...(record.bio ? { bio: record.bio } : {}),
    ...(record.image ? { image: record.image } : {}),
    ...(expertise?.length ? { expertise } : {}),
    ...(qualifications?.length ? { qualifications } : {}),
    ...(researchInterests?.length ? { researchInterests } : {}),
    ...(record.serviceLinks.length ? { serviceIds: record.serviceLinks.map((link) => link.serviceId) } : {}),
    ...(record.researchLinks.length ? { researchIds: record.researchLinks.map((link) => link.researchId) } : {}),
    ...(record.articleLinks.length ? { articleIds: record.articleLinks.map((link) => link.articleId) } : {}),
    ...(record.featured ? { featured: true } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function runExpertQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Expert database query failed:", error);
    }
    throw new Error("Unable to load Experts from the database.");
  }
}

const relationInclude = {
  researchLinks: { select: { researchId: true } },
  serviceLinks: { select: { serviceId: true } },
  articleLinks: { select: { articleId: true } },
} as const;

export async function getPublishedExperts(): Promise<Expert[]> {
  const records = await runExpertQuery(() =>
    prisma.client.expert.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: relationInclude,
    }),
  );
  return records.map(toDomainExpert);
}

export async function getPublishedExpertById(id: string): Promise<Expert | undefined> {
  const record = await runExpertQuery(() =>
    prisma.client.expert.findFirst({
      where: { id, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainExpert(record) : undefined;
}

export async function getPublishedExpertBySlug(slug: string): Promise<Expert | undefined> {
  const record = await runExpertQuery(() =>
    prisma.client.expert.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainExpert(record) : undefined;
}

export async function getPublishedExpertDisciplines(): Promise<string[]> {
  const experts = await getPublishedExperts();
  return Array.from(
    new Set(
      experts
        .map((expert) => expert.discipline)
        .filter((discipline): discipline is string => Boolean(discipline)),
    ),
  );
}

export async function getFeaturedPublishedExperts(): Promise<Expert[]> {
  const experts = await getPublishedExperts();
  return experts.filter((expert) => expert.featured);
}
