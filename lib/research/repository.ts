import "server-only";

import type { ResearchItem as PrismaResearchItem } from "@/generated/prisma/client";
import type {
  ResearchEntry,
  ResearchMethodology,
  ResearchPoint,
  ResearchSection,
  ResearchSeo,
} from "@/data/research";
import { getPrismaClient } from "@/lib/db/prisma";

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item): item is string => typeof item === "string")) return undefined;
  return value;
}

function asResearchPoints(value: unknown): ResearchPoint[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const points: ResearchPoint[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return undefined;
    const record = item as Record<string, unknown>;
    if (typeof record.title !== "string" || typeof record.description !== "string") return undefined;
    points.push({ title: record.title, description: record.description });
  }
  return points;
}

function asResearchSections(value: unknown): ResearchSection[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const sections: ResearchSection[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return undefined;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.title !== "string" || typeof record.content !== "string") {
      return undefined;
    }
    if (record.intro !== undefined && typeof record.intro !== "string") return undefined;
    if (record.keyPoints !== undefined && asStringArray(record.keyPoints) === undefined) return undefined;
    sections.push({
      id: record.id,
      title: record.title,
      ...(record.intro !== undefined ? { intro: record.intro } : {}),
      content: record.content,
      ...(record.keyPoints !== undefined ? { keyPoints: record.keyPoints as string[] } : {}),
    });
  }
  return sections;
}

function asMethodology(value: unknown): ResearchMethodology | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (typeof record.approach !== "string") return undefined;
  if (record.methods !== undefined && asStringArray(record.methods) === undefined) return undefined;
  if (record.sources !== undefined && asStringArray(record.sources) === undefined) return undefined;
  if (record.framework !== undefined && typeof record.framework !== "string") return undefined;
  return {
    approach: record.approach,
    ...(record.methods !== undefined ? { methods: record.methods as string[] } : {}),
    ...(record.sources !== undefined ? { sources: record.sources as string[] } : {}),
    ...(record.framework !== undefined ? { framework: record.framework } : {}),
  };
}

function asSeo(value: {
  title: string | null;
  description: string | null;
  image: string | null;
  canonical: string | null;
  noIndex: boolean;
}): ResearchSeo | undefined {
  if (!value.title && !value.description && !value.image && !value.canonical && !value.noIndex) {
    return undefined;
  }
  return {
    ...(value.title ? { title: value.title } : {}),
    ...(value.description ? { description: value.description } : {}),
    ...(value.image ? { image: value.image } : {}),
    ...(value.canonical ? { canonical: value.canonical } : {}),
    ...(value.noIndex ? { noIndex: true } : {}),
  };
}

type PrismaResearchWithRelations = PrismaResearchItem & {
  serviceLinks: Array<{ serviceId: string }>;
  expertLinks: Array<{ expertId: string }>;
  articleLinks: Array<{ articleId: string }>;
  workshopLinks: Array<{ eventId: string }>;
  imageMedia: { publicUrl: string } | null;
};

function toDomainResearch(record: PrismaResearchWithRelations): ResearchEntry {
  const seo = asSeo({
    title: record.seoTitle,
    description: record.seoDescription,
    image: record.seoImage,
    canonical: record.seoCanonical,
    noIndex: record.seoNoIndex,
  });

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    category: record.category,
    shortDescription: record.shortDescription,
    ...(record.summary ? { summary: record.summary } : {}),
    ...(record.serviceLinks.length ? { relatedServiceIds: record.serviceLinks.map((link) => link.serviceId) } : {}),
    ...(record.expertLinks.length ? { expertIds: record.expertLinks.map((link) => link.expertId) } : {}),
    ...(record.articleLinks.length ? { relatedArticleIds: record.articleLinks.map((link) => link.articleId) } : {}),
    ...(record.workshopLinks.length ? { relatedWorkshopIds: record.workshopLinks.map((link) => link.eventId) } : {}),
    ...(record.scope ? { scope: asResearchPoints(record.scope) } : {}),
    ...(record.topics ? { topics: asResearchPoints(record.topics) } : {}),
    ...(record.sections ? { sections: asResearchSections(record.sections) } : {}),
    ...(record.methodology ? { methodology: asMethodology(record.methodology) } : {}),
    ...(record.audience ? { audience: asStringArray(record.audience) } : {}),
    ...(record.highlights ? { highlights: asStringArray(record.highlights) } : {}),
    ...(record.date ? { date: record.date.toISOString() } : {}),
    ...(record.status === "PUBLISHED" ? { status: record.availability === "COMING_SOON" ? "Coming Soon" : "Published" } : {}),
    ...(record.type ? { type: record.type } : {}),
    ...(record.topic ? { topic: record.topic } : {}),
    ...(record.imageMedia?.publicUrl || record.image ? { image: record.imageMedia?.publicUrl ?? record.image! } : {}),
    ...(record.featured ? { featured: true } : {}),
    ...(record.tags ? { tags: asStringArray(record.tags) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function runResearchQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Research database query failed:", error);
    }
    throw new Error("Unable to load Research from the database.");
  }
}

export async function getPublishedResearch() {
  return runResearchQuery(async () => {
    const records = await getPrismaClient().researchItem.findMany({
      where: { status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { serviceLinks: { select: { serviceId: true } }, expertLinks: { select: { expertId: true } }, articleLinks: { select: { articleId: true } }, workshopLinks: { select: { eventId: true } }, imageMedia: { select: { publicUrl: true } } },
    });
    return records.map(toDomainResearch);
  });
}

export async function getPublishedResearchById(id: string) {
  return runResearchQuery(async () => {
    const record = await getPrismaClient().researchItem.findFirst({
      where: { id, status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
      include: { serviceLinks: { select: { serviceId: true } }, expertLinks: { select: { expertId: true } }, articleLinks: { select: { articleId: true } }, workshopLinks: { select: { eventId: true } }, imageMedia: { select: { publicUrl: true } } },
    });
    return record ? toDomainResearch(record) : undefined;
  });
}

export async function getPublishedResearchBySlug(slug: string) {
  return runResearchQuery(async () => {
    const record = await getPrismaClient().researchItem.findFirst({
      where: { slug, status: "PUBLISHED", OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }] },
      include: { serviceLinks: { select: { serviceId: true } }, expertLinks: { select: { expertId: true } }, articleLinks: { select: { articleId: true } }, workshopLinks: { select: { eventId: true } }, imageMedia: { select: { publicUrl: true } } },
    });
    return record ? toDomainResearch(record) : undefined;
  });
}

export async function getPublishedResearchCategories() {
  const entries = await getPublishedResearch();
  return Array.from(new Set(entries.map((entry) => entry.category)));
}

export async function getFeaturedPublishedResearch() {
  const entries = await getPublishedResearch();
  return entries.filter((entry) => entry.featured);
}

export async function getRelatedPublishedResearch(research: ResearchEntry) {
  const entries = await getPublishedResearch();
  return entries.filter((candidate) => {
    if (candidate.id === research.id || candidate.slug === research.slug) return false;
    if (candidate.category !== research.category) return false;
    if (!research.tags?.length || !candidate.tags?.length) return false;
    return research.tags.some((tag) => candidate.tags?.includes(tag));
  });
}


export async function getPreviewResearchById(id: string) {
  return runResearchQuery(async () => {
    const record = await getPrismaClient().researchItem.findUnique({ where: { id }, include: { serviceLinks: { select: { serviceId: true } }, expertLinks: { select: { expertId: true } }, articleLinks: { select: { articleId: true } }, workshopLinks: { select: { eventId: true } }, imageMedia: { select: { publicUrl: true } } } });
    return record ? toDomainResearch(record) : undefined;
  });
}
