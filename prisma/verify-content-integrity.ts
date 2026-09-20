import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = { client: new PrismaClient({ adapter }) };

type Issue = {
  relation: string;
  sourceId: string;
  targetId?: string;
  message: string;
};

const issues: Issue[] = [];

function add(relation: string, sourceId: string, message: string, targetId?: string) {
  issues.push({ relation, sourceId, targetId, message });
}

const [
  serviceResearch,
  serviceExperts,
  serviceArticles,
  serviceEvents,
  researchExperts,
  researchArticles,
  researchEvents,
  articleExperts,
  articleRelations,
  eventRelations,
  speakerEvents,
] = await Promise.all([
  prisma.client.researchService.findMany({ include: { service: true, research: true } }),
  prisma.client.expertService.findMany({ include: { service: true, expert: true } }),
  prisma.client.articleService.findMany({ include: { service: true, article: true } }),
  prisma.client.workshopService.findMany({ include: { service: true, event: true } }),
  prisma.client.expertResearch.findMany({ include: { expert: true, research: true } }),
  prisma.client.articleResearch.findMany({ include: { article: true, research: true } }),
  prisma.client.workshopResearch.findMany({ include: { event: true, research: true } }),
  prisma.client.articleExpert.findMany({ include: { article: true, expert: true } }),
  prisma.client.articleRelation.findMany({ include: { sourceArticle: true, targetArticle: true } }),
  prisma.client.eventRelation.findMany({ include: { sourceEvent: true, targetEvent: true } }),
  prisma.client.event.findMany({ where: { speakerId: { not: null } }, include: { speaker: true } }),
]);

const relationSets: Array<[string, string[]]> = [
  ["Service↔Research", serviceResearch.map((r) => `${r.researchId}:${r.serviceId}`)],
  ["Service↔Expert", serviceExperts.map((r) => `${r.expertId}:${r.serviceId}`)],
  ["Service↔Article", serviceArticles.map((r) => `${r.articleId}:${r.serviceId}`)],
  ["Service↔Workshop", serviceEvents.map((r) => `${r.eventId}:${r.serviceId}`)],
  ["Research↔Expert", researchExperts.map((r) => `${r.expertId}:${r.researchId}`)],
  ["Research↔Article", researchArticles.map((r) => `${r.articleId}:${r.researchId}`)],
  ["Research↔Workshop", researchEvents.map((r) => `${r.eventId}:${r.researchId}`)],
  ["Article↔Expert", articleExperts.map((r) => `${r.articleId}:${r.expertId}`)],
  ["Article↔Article", articleRelations.map((r) => `${r.sourceArticleId}:${r.targetArticleId}`)],
  ["Workshop↔Workshop", eventRelations.map((r) => `${r.sourceEventId}:${r.targetEventId}`)],
];

for (const [relation, keys] of relationSets) {
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) add(relation, key, "duplicate relationship row");
    seen.add(key);
  }
}

for (const row of serviceResearch) {
  if (!row.service || !row.research) add("Service↔Research", row.serviceId, "missing referenced record", row.researchId);
}
for (const row of serviceExperts) {
  if (!row.service || !row.expert) add("Service↔Expert", row.serviceId, "missing referenced record", row.expertId);
}
for (const row of serviceArticles) {
  if (!row.service || !row.article) add("Service↔Article", row.serviceId, "missing referenced record", row.articleId);
}
for (const row of serviceEvents) {
  if (!row.service || !row.event) add("Service↔Workshop", row.serviceId, "missing referenced record", row.eventId);
}
for (const row of researchExperts) {
  if (!row.expert || !row.research) add("Research↔Expert", row.researchId, "missing referenced record", row.expertId);
}
for (const row of researchArticles) {
  if (!row.article || !row.research) add("Research↔Article", row.researchId, "missing referenced record", row.articleId);
}
for (const row of researchEvents) {
  if (!row.event || !row.research) add("Research↔Workshop", row.researchId, "missing referenced record", row.eventId);
}
for (const row of articleExperts) {
  if (!row.article || !row.expert) add("Article↔Expert", row.articleId, "missing referenced record", row.expertId);
}
for (const row of articleRelations) {
  if (!row.sourceArticle || !row.targetArticle) add("Article↔Article", row.sourceArticleId, "missing referenced record", row.targetArticleId);
  if (row.sourceArticleId === row.targetArticleId) add("Article↔Article", row.sourceArticleId, "self-relation is not allowed");
}
for (const row of eventRelations) {
  if (!row.sourceEvent || !row.targetEvent) add("Workshop↔Workshop", row.sourceEventId, "missing referenced record", row.targetEventId);
  if (row.sourceEventId === row.targetEventId) add("Workshop↔Workshop", row.sourceEventId, "self-relation is not allowed");
}
for (const row of speakerEvents) {
  if (!row.speaker) add("Workshop↔Expert", row.id, "missing speaker record", row.speakerId ?? undefined);
}

const publicVisibility = await Promise.all([
  prisma.client.researchService.count({ where: { service: { status: "PUBLISHED" }, research: { status: { not: "PUBLISHED" } } } }),
  prisma.client.expertService.count({ where: { service: { status: "PUBLISHED" }, expert: { status: { not: "PUBLISHED" } } } }),
  prisma.client.articleService.count({ where: { article: { status: "PUBLISHED" }, service: { status: { not: "PUBLISHED" } } } }),
  prisma.client.workshopService.count({ where: { event: { status: "PUBLISHED" }, service: { status: { not: "PUBLISHED" } } } }),
  prisma.client.expertResearch.count({ where: { research: { status: "PUBLISHED" }, expert: { status: { not: "PUBLISHED" } } } }),
  prisma.client.articleResearch.count({ where: { article: { status: "PUBLISHED" }, research: { status: { not: "PUBLISHED" } } } }),
  prisma.client.workshopResearch.count({ where: { event: { status: "PUBLISHED" }, research: { status: { not: "PUBLISHED" } } } }),
  prisma.client.articleExpert.count({ where: { article: { status: "PUBLISHED" }, expert: { status: { not: "PUBLISHED" } } } }),
  prisma.client.articleRelation.count({ where: { sourceArticle: { status: "PUBLISHED" }, targetArticle: { status: { not: "PUBLISHED" } } } }),
  prisma.client.eventRelation.count({ where: { sourceEvent: { status: "PUBLISHED" }, targetEvent: { status: { not: "PUBLISHED" } } } }),
]);

console.log(JSON.stringify({
  ok: issues.length === 0,
  relationshipCounts: Object.fromEntries(relationSets.map(([name, keys]) => [name, keys.length])),
  hiddenPublicRelations: {
    serviceResearch: publicVisibility[0],
    serviceExpert: publicVisibility[1],
    serviceArticle: publicVisibility[2],
    serviceWorkshop: publicVisibility[3],
    researchExpert: publicVisibility[4],
    researchArticle: publicVisibility[5],
    researchWorkshop: publicVisibility[6],
    articleExpert: publicVisibility[7],
    articleRelation: publicVisibility[8],
    workshopRelation: publicVisibility[9],
  },
  issues,
}, null, 2));

await prisma.client.$disconnect();
if (issues.length) process.exit(1);
