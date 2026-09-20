import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { canonicalArticles, validateArticles } from "../data/articles";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify Articles.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const normalize = (value: unknown) => value == null ? null : JSON.stringify(value);

async function resolveId(model: "expert" | "researchItem" | "service" | "article", reference: string) {
  if (model === "expert") {
    const item = (await prisma.expert.findUnique({ where: { id: reference }, select: { id: true } })) ??
      (await prisma.expert.findUnique({ where: { slug: reference }, select: { id: true } }));
    return item?.id;
  }
  if (model === "researchItem") {
    const item = (await prisma.researchItem.findUnique({ where: { id: reference }, select: { id: true } })) ??
      (await prisma.researchItem.findUnique({ where: { slug: reference }, select: { id: true } }));
    return item?.id;
  }
  if (model === "service") {
    const item = (await prisma.service.findUnique({ where: { id: reference }, select: { id: true } })) ??
      (await prisma.service.findUnique({ where: { slug: reference }, select: { id: true } }));
    return item?.id;
  }
  const item = (await prisma.article.findUnique({ where: { id: reference }, select: { id: true } })) ??
    (await prisma.article.findUnique({ where: { slug: reference }, select: { id: true } }));
  return item?.id;
}

async function main() {
  validateArticles();
  const records = await prisma.article.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      researchLinks: { select: { researchId: true } },
      serviceLinks: { select: { serviceId: true } },
      expertLinks: { select: { expertId: true } },
      relatedFrom: { select: { targetArticleId: true } },
    },
  });
  const expectedBySlug = new Map(canonicalArticles.map((article, index) => [article.slug, { article, index }]));
  const errors: string[] = [];

  if (records.length !== canonicalArticles.length) errors.push(`Expected ${canonicalArticles.length} Articles, found ${records.length}.`);

  for (const record of records) {
    const expected = expectedBySlug.get(record.slug);
    if (!expected) {
      errors.push(`Unexpected Article record: ${record.slug}`);
      continue;
    }
    const { article, index } = expected;
    const checks: Array<[string, unknown, unknown]> = [
      ["id", record.id, article.id],
      ["title", record.title, article.title],
      ["slug", record.slug, article.slug],
      ["category", record.category, article.category],
      ["order", record.order, index],
      ["date", record.date?.toISOString() ?? null, article.date ? new Date(article.date).toISOString() : null],
      ["author", record.author, article.author ?? null],
      ["authorRole", record.authorRole, article.authorRole ?? null],
      ["authorSlug", record.authorSlug, article.authorSlug ?? null],
      ["excerpt", record.excerpt, article.excerpt ?? null],
      ["content", record.content, article.content ?? null],
      ["sections", normalize(record.sections), normalize(article.sections)],
      ["image", record.image, article.image ?? null],
      ["featured", record.featured, article.featured ?? false],
      ["tags", normalize(record.tags), normalize(article.tags)],
      ["status", record.status, "PUBLISHED"],
      ["seoTitle", record.seoTitle, article.seo?.title ?? null],
      ["seoDescription", record.seoDescription, article.seo?.description ?? null],
      ["seoImage", record.seoImage, article.seo?.image ?? null],
    ];
    for (const [field, actual, expectedValue] of checks) {
      if (actual !== expectedValue) errors.push(`${article.slug}: ${field} mismatch.`);
    }

    for (const [field, model, refs, actual] of [
      ["Research", "researchItem", article.relatedResearch ?? [], record.researchLinks.map((x) => x.researchId)],
      ["Service", "service", article.relatedServices ?? [], record.serviceLinks.map((x) => x.serviceId)],
      ["Article", "article", article.relatedArticles ?? [], record.relatedFrom.map((x) => x.targetArticleId)],
    ] as const) {
      const expectedIds: string[] = [];
      for (const reference of refs) {
        const id = await resolveId(model, reference);
        if (!id) errors.push(`${article.slug}: missing ${field} target ${reference}`);
        else expectedIds.push(id);
      }
      expectedIds.sort();
      const actualIds = [...actual].sort();
      if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) errors.push(`${article.slug}: Article ↔ ${field} relationship mismatch.`);
    }

    const authorReference = article.authorId ?? article.authorSlug;
    const expectedExpertId = authorReference ? await resolveId("expert", authorReference) : undefined;
    const actualExpertIds = record.expertLinks.map((x) => x.expertId).sort();
    const expectedExpertIds = expectedExpertId ? [expectedExpertId] : [];
    if (JSON.stringify(actualExpertIds) !== JSON.stringify(expectedExpertIds.sort())) errors.push(`${article.slug}: Article ↔ Expert relationship mismatch.`);
  }

  const duplicateIds = await prisma.article.groupBy({ by: ["id"], _count: { id: true }, having: { id: { _count: { gt: 1 } } } });
  const duplicateSlugs = await prisma.article.groupBy({ by: ["slug"], _count: { slug: true }, having: { slug: { _count: { gt: 1 } } } });
  if (duplicateIds.length) errors.push("Duplicate Article IDs detected.");
  if (duplicateSlugs.length) errors.push("Duplicate Article slugs detected.");

  if (errors.length) {
    console.error("ARTICLE INTEGRITY FAILED");
    errors.forEach((error) => console.error(" - " + error));
    process.exitCode = 1;
    return;
  }
  console.log(`ARTICLE INTEGRITY PASSED — ${records.length} canonical Articles match.`);
}

main()
  .catch((error) => {
    console.error("Article verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
