import "server-only";

import type { Article as PrismaArticle } from "@/generated/prisma/client";
import type { Article, ArticleSection, ArticleSeo } from "@/data/articles";
import { prisma } from "@/lib/db/prisma";

type ArticleWithRelations = PrismaArticle & {
  researchLinks: Array<{ researchId: string }>;
  serviceLinks: Array<{ serviceId: string }>;
  expertLinks: Array<{ expertId: string }>;
  relatedFrom: Array<{ targetArticleId: string }>;
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item): item is string => typeof item === "string")) return undefined;
  return value;
}

function asSections(value: unknown): ArticleSection[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const sections: ArticleSection[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return undefined;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.content !== "string") return undefined;
    if (record.heading !== undefined && typeof record.heading !== "string") return undefined;
    if (record.type !== undefined && record.type !== "paragraph" && record.type !== "list") return undefined;
    sections.push({
      id: record.id,
      content: record.content,
      ...(typeof record.heading === "string" ? { heading: record.heading } : {}),
      ...(record.type === "list" ? { type: "list" as const } : {}),
    });
  }
  return sections;
}

function toSeo(record: PrismaArticle): ArticleSeo | undefined {
  if (!record.seoTitle && !record.seoDescription && !record.seoImage) return undefined;
  return {
    ...(record.seoTitle ? { title: record.seoTitle } : {}),
    ...(record.seoDescription ? { description: record.seoDescription } : {}),
    ...(record.seoImage ? { image: record.seoImage } : {}),
  };
}

function toDomainArticle(record: ArticleWithRelations): Article {
  const tags = asStringArray(record.tags);
  const sections = asSections(record.sections);
  const seo = toSeo(record);

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    category: record.category,
    ...(record.date ? { date: record.date.toISOString() } : {}),
    ...(record.author ? { author: record.author } : {}),
    ...(record.authorId ? { authorId: record.authorId } : {}),
    ...(record.authorRole ? { authorRole: record.authorRole } : {}),
    ...(record.authorSlug ? { authorSlug: record.authorSlug } : {}),
    ...(record.excerpt ? { excerpt: record.excerpt } : {}),
    ...(record.content ? { content: record.content } : {}),
    ...(sections?.length ? { sections } : {}),
    ...(record.image ? { image: record.image } : {}),
    ...(record.featured ? { featured: true } : {}),
    ...(tags?.length ? { tags } : {}),
    ...(record.relatedFrom.length ? { relatedArticles: record.relatedFrom.map((item) => item.targetArticleId) } : {}),
    ...(record.researchLinks.length ? { relatedResearch: record.researchLinks.map((item) => item.researchId) } : {}),
    ...(record.serviceLinks.length ? { relatedServices: record.serviceLinks.map((item) => item.serviceId) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function runArticleQuery<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Article database query failed:", error);
    throw new Error("Unable to load Articles from the database.");
  }
}

const relationInclude = {
  researchLinks: { select: { researchId: true } },
  serviceLinks: { select: { serviceId: true } },
  expertLinks: { select: { expertId: true } },
  relatedFrom: { select: { targetArticleId: true } },
} as const;

export async function getPublishedArticles(): Promise<Article[]> {
  const records = await runArticleQuery(() =>
    prisma.client.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: relationInclude,
    }),
  );
  return records.map(toDomainArticle);
}

export async function getPublishedArticleById(id: string): Promise<Article | undefined> {
  const record = await runArticleQuery(() =>
    prisma.client.article.findFirst({
      where: { id, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainArticle(record) : undefined;
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | undefined> {
  const record = await runArticleQuery(() =>
    prisma.client.article.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: relationInclude,
    }),
  );
  return record ? toDomainArticle(record) : undefined;
}

export async function getPublishedArticleCategories(): Promise<string[]> {
  const articles = await getPublishedArticles();
  return Array.from(new Set(articles.map((article) => article.category).filter(Boolean)));
}

export async function getFeaturedPublishedArticles(): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.featured);
}

export async function getRelatedPublishedArticles(article: Article): Promise<Article[]> {
  if (article.relatedArticles?.length) {
    const records = await Promise.all(article.relatedArticles.map((id) => getPublishedArticleById(id)));
    return records.filter((item): item is Article => Boolean(item));
  }

  const articles = await getPublishedArticles();
  return articles.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.category === article.category &&
      Boolean(article.tags?.some((tag) => candidate.tags?.includes(tag))),
  );
}
