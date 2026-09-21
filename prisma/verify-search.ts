import "dotenv/config";

import { prisma } from "@/lib/db/prisma";
import { searchContent } from "@/lib/search/service";
import { normalizeSearchQuery, parseSearchFilters } from "@/lib/search/validation";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to verify search.");
  const marker = "phase820" + Date.now().toString(36);
  const slug = (suffix: string) => marker + "-" + suffix;

  const service = await prisma.client.service.create({ data: { slug: slug("service"), title: marker + " Service", category: "Research", shortDescription: "Search verification service", status: "PUBLISHED" } });
  const research = await prisma.client.researchItem.create({ data: { slug: slug("research"), title: marker + " Research", category: "Methods", shortDescription: "Search verification research", status: "PUBLISHED" } });
  const expert = await prisma.client.expert.create({ data: { slug: slug("expert"), name: marker + " Expert", role: "Researcher", status: "PUBLISHED" } });
  const article = await prisma.client.article.create({ data: { slug: slug("article"), title: marker + " Article", category: "Methods", excerpt: "Search verification article", status: "PUBLISHED" } });
  const event = await prisma.client.event.create({ data: { slug: slug("event"), title: marker + " Workshop", date: new Date(Date.now() + 86400000), category: "Research", shortDescription: "Search verification workshop", status: "PUBLISHED" } });
  const draft = await prisma.client.service.create({ data: { slug: slug("draft"), title: marker + " Draft", category: "Internal", shortDescription: "Must not be public", status: "DRAFT" } });
  const scheduled = await prisma.client.article.create({ data: { slug: slug("scheduled"), title: marker + " Scheduled", category: "Internal", excerpt: "Must not be public", status: "PUBLISHED", publishAt: new Date(Date.now() + 86400000) } });

  try {
    const result = await searchContent({ query: marker, type: "all", page: 1, pageSize: 2 });
    if (!result || result.pagination.totalResults < 5) throw new Error("Published cross-domain search failed.");
    if (result.pagination.totalPages < 3 || !result.pagination.hasNextPage) throw new Error("Bounded pagination failed.");
    if (result.results.some((item) => item.id === draft.id || item.id === scheduled.id)) throw new Error("Unpublished content leaked into public search.");

    const serviceOnly = await searchContent({ query: marker, type: "services", page: 1, pageSize: 20 });
    if (!serviceOnly || !serviceOnly.results.some((item) => item.id === service.id) || serviceOnly.results.some((item) => item.contentType !== "services")) throw new Error("Content-type filtering failed.");

    const normalized = normalizeSearchQuery("  " + marker + "   service  ");
    if (normalized !== marker + " service") throw new Error("Search normalization failed.");
    if (normalizeSearchQuery(" ") !== null || normalizeSearchQuery("x") !== null || normalizeSearchQuery("x".repeat(161)) !== null) throw new Error("Search query validation failed.");

    const invalidType = parseSearchFilters("not-a-type", "999999", "999");
    if (invalidType.type !== "all" || invalidType.page !== 1 || invalidType.pageSize !== 10) throw new Error("Filter bounds failed.");

    const injectionLike = await searchContent({ query: marker + " ' OR 1=1 --" });
    if (!injectionLike) throw new Error("Unexpected invalid search response.");
    console.log("Search infrastructure verification passed.");
  } finally {
    await prisma.client.service.deleteMany({ where: { id: { in: [service.id, draft.id] } } });
    await prisma.client.researchItem.delete({ where: { id: research.id } });
    await prisma.client.expert.delete({ where: { id: expert.id } });
    await prisma.client.article.deleteMany({ where: { id: { in: [article.id, scheduled.id] } } });
    await prisma.client.event.delete({ where: { id: event.id } });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
