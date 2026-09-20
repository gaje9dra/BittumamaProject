import "dotenv/config";

import { Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalArticles, validateArticles } from "../data/articles";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed Articles.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function jsonValue(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function dateValue(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid canonical Article date: ${value}`);
  return date;
}

async function resolveExpert(reference: string) {
  return (
    (await prisma.expert.findUnique({ where: { id: reference }, select: { id: true, slug: true } })) ??
    (await prisma.expert.findUnique({ where: { slug: reference }, select: { id: true, slug: true } }))
  );
}

async function resolveResearch(reference: string) {
  return (
    (await prisma.researchItem.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.researchItem.findUnique({ where: { slug: reference }, select: { id: true } }))
  );
}

async function resolveService(reference: string) {
  return (
    (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }))
  );
}

async function resolveArticle(reference: string) {
  return (
    (await prisma.article.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.article.findUnique({ where: { slug: reference }, select: { id: true } }))
  );
}

async function main() {
  validateArticles();

  for (const [index, article] of canonicalArticles.entries()) {
    let authorId: string | null = article.authorId ?? null;
    const authorReference = article.authorId ?? article.authorSlug;

    if (authorReference) {
      const expert = await resolveExpert(authorReference);
      if (!expert) throw new Error(`Article references missing Expert: ${authorReference}`);
      authorId = expert.id;
    }

    await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        order: index,
        date: dateValue(article.date),
        author: article.author ?? null,
        authorRole: article.authorRole ?? null,
        authorSlug: article.authorSlug ?? null,
        excerpt: article.excerpt ?? null,
        content: article.content ?? null,
        sections: jsonValue(article.sections),
        image: article.image ?? null,
        featured: article.featured ?? false,
        tags: jsonValue(article.tags),
        status: "PUBLISHED",
        authorId,
        seoTitle: article.seo?.title ?? null,
        seoDescription: article.seo?.description ?? null,
        seoImage: article.seo?.image ?? null,
      },
      update: {
        id: article.id,
        title: article.title,
        category: article.category,
        order: index,
        date: dateValue(article.date),
        author: article.author ?? null,
        authorRole: article.authorRole ?? null,
        authorSlug: article.authorSlug ?? null,
        excerpt: article.excerpt ?? null,
        content: article.content ?? null,
        sections: jsonValue(article.sections),
        image: article.image ?? null,
        featured: article.featured ?? false,
        tags: jsonValue(article.tags),
        status: "PUBLISHED",
        authorId,
        seoTitle: article.seo?.title ?? null,
        seoDescription: article.seo?.description ?? null,
        seoImage: article.seo?.image ?? null,
      },
    });
  }

  for (const article of canonicalArticles) {
    const record = await prisma.article.findUnique({ where: { slug: article.slug }, select: { id: true } });
    if (!record) throw new Error(`Seeded Article could not be reloaded: ${article.slug}`);

    await prisma.articleResearch.deleteMany({ where: { articleId: record.id } });
    await prisma.articleService.deleteMany({ where: { articleId: record.id } });
    await prisma.articleExpert.deleteMany({ where: { articleId: record.id } });
    await prisma.articleRelation.deleteMany({
      where: { OR: [{ sourceArticleId: record.id }, { targetArticleId: record.id }] },
    });

    const researchIds: string[] = [];
    for (const reference of article.relatedResearch ?? []) {
      const target = await resolveResearch(reference);
      if (!target) throw new Error(`${article.slug} references missing Research: ${reference}`);
      researchIds.push(target.id);
    }
    if (researchIds.length) {
      await prisma.articleResearch.createMany({
        data: researchIds.map((researchId) => ({ articleId: record.id, researchId })),
        skipDuplicates: true,
      });
    }

    const serviceIds: string[] = [];
    for (const reference of article.relatedServices ?? []) {
      const target = await resolveService(reference);
      if (!target) throw new Error(`${article.slug} references missing Service: ${reference}`);
      serviceIds.push(target.id);
    }
    if (serviceIds.length) {
      await prisma.articleService.createMany({
        data: serviceIds.map((serviceId) => ({ articleId: record.id, serviceId })),
        skipDuplicates: true,
      });
    }

    const authorReference = article.authorId ?? article.authorSlug;
    if (authorReference) {
      const expert = await resolveExpert(authorReference);
      if (!expert) throw new Error(`${article.slug} references missing Expert: ${authorReference}`);
      await prisma.articleExpert.create({
        data: { articleId: record.id, expertId: expert.id },
      });
    }

    for (const reference of article.relatedArticles ?? []) {
      const target = await resolveArticle(reference);
      if (!target) throw new Error(`${article.slug} references missing Article: ${reference}`);
      await prisma.articleRelation.create({
        data: { sourceArticleId: record.id, targetArticleId: target.id },
      });
    }
  }

  console.log(`Seeded ${canonicalArticles.length} canonical Articles.`);
}

main()
  .catch((error) => {
    console.error("Article seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
