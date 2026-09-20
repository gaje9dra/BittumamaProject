import type { Service } from "@/data/services";
import { getPublishedArticles } from "@/lib/articles/repository";
import {
  getPublishedServiceById,
  getPublishedServiceBySlug,
} from "@/lib/services/repository";
import {
  getPublishedResearch,
  getPublishedResearchById,
  getPublishedResearchBySlug,
} from "@/lib/research/repository";
import { getPublishedExpertById, getPublishedExpertBySlug, getPublishedExperts } from "@/lib/experts/repository";
import type { ResearchEntry } from "@/data/research";
import type { Expert } from "@/data/expertise";
import type { Article } from "@/data/articles";
import { getPublishedEventById, getPublishedEventBySlug, type Event } from "@/lib/events/repository";

export type ContentRelationshipValidationIssue = {
  sourceType: "service" | "research" | "expert" | "article" | "event";
  sourceId: string;
  relation: string;
  reference: string;
  message: string;
};

export async function getServicesForResearch(research: ResearchEntry): Promise<Service[]> {
  const services = await Promise.all(
    (research.relatedServiceIds ?? []).map(async (reference) =>
      (await getPublishedServiceById(reference)) ??
      (await getPublishedServiceBySlug(reference)),
    ),
  );
  return services.filter((item): item is Service => Boolean(item));
}

export async function getResearchForService(serviceId: string): Promise<ResearchEntry[]> {
  const service =
    (await getPublishedServiceById(serviceId)) ??
    (await getPublishedServiceBySlug(serviceId));
  if (!service) return [];

  const research = await getPublishedResearch();
  return research.filter((entry) =>
    entry.relatedServiceIds?.some(
      (reference) => reference === service.id || reference === service.slug,
    ),
  );
}

export async function getArticlesForService(serviceId: string): Promise<Article[]> {
  const service =
    (await getPublishedServiceById(serviceId)) ??
    (await getPublishedServiceBySlug(serviceId));
  if (!service) return [];

  const articles = await getPublishedArticles();
  return articles.filter((article) => article.relatedServices?.includes(service.id));
}

export async function getExpertsForService(serviceId: string): Promise<Expert[]> {
  const service =
    (await getPublishedServiceById(serviceId)) ??
    (await getPublishedServiceBySlug(serviceId));
  if (!service) return [];

  const experts = await getPublishedExperts();
  return experts.filter((expert) => expert.serviceIds?.includes(service.id));
}

export async function getArticlesForResearch(researchId: string): Promise<Article[]> {
  const research =
    (await getPublishedResearchById(researchId)) ??
    (await getPublishedResearchBySlug(researchId));
  if (!research) return [];

  const articles = await getPublishedArticles();
  return articles.filter((article) => article.relatedResearch?.includes(research.id));
}

export async function getExpertsForResearch(researchId: string): Promise<Expert[]> {
  const research =
    (await getPublishedResearchById(researchId)) ??
    (await getPublishedResearchBySlug(researchId));
  if (!research) return [];

  const experts = await import("@/lib/experts/repository").then((module) => module.getPublishedExperts());
  return experts.filter((expert) => expert.researchIds?.includes(research.id));
}

export async function getExpertForArticle(article: Article): Promise<Expert | undefined> {
  if (article.authorId) {
    const expert = await getPublishedExpertById(article.authorId);
    if (expert) return expert;
  }
  if (article.authorSlug) return getPublishedExpertBySlug(article.authorSlug);
  return undefined;
}

export async function getResearchForArticle(article: Article): Promise<ResearchEntry[]> {
  const references = article.relatedResearch ?? [];
  const research = await Promise.all(
    references.map(async (reference) =>
      (await getPublishedResearchById(reference)) ??
      (await getPublishedResearchBySlug(reference)),
    ),
  );
  return research.filter((item): item is ResearchEntry => Boolean(item));
}

export async function getServicesForArticle(article: Article): Promise<Service[]> {
  const services = await Promise.all(
    (article.relatedServices ?? []).map(async (reference) =>
      (await getPublishedServiceById(reference)) ??
      (await getPublishedServiceBySlug(reference)),
    ),
  );
  return services.filter((item): item is Service => Boolean(item));
}

export async function getExpertForWorkshop(event: Event): Promise<Expert | undefined> {
  if (event.speakerId) return getPublishedExpertById(event.speakerId);
  if (event.speakerSlug) return getPublishedExpertBySlug(event.speakerSlug);
  return undefined;
}

export async function getResearchForWorkshop(event: Event): Promise<ResearchEntry[]> {
  const research = await Promise.all(
    (event.relatedResearchIds ?? []).map(async (reference) =>
      (await getPublishedResearchById(reference)) ??
      (await getPublishedResearchBySlug(reference)),
    ),
  );
  return research.filter((item): item is ResearchEntry => Boolean(item));
}

export async function getServicesForWorkshop(event: Event): Promise<Service[]> {
  const services = await Promise.all(
    (event.relatedServiceIds ?? []).map(async (reference) =>
      (await getPublishedServiceById(reference)) ??
      (await getPublishedServiceBySlug(reference)),
    ),
  );
  return services.filter((item): item is Service => Boolean(item));
}

export async function getServicesForExpert(expertId: string): Promise<Service[]> {
  const expert =
    (await getPublishedExpertById(expertId)) ??
    (await getPublishedExpertBySlug(expertId));
  if (!expert) return [];

  const services = await Promise.all(
    (expert.serviceIds ?? []).map((id) => getPublishedServiceById(id)),
  );
  return services.filter((item): item is Service => Boolean(item));
}

export async function getResearchForExpert(expertId: string): Promise<ResearchEntry[]> {
  const expert =
    (await getPublishedExpertById(expertId)) ??
    (await getPublishedExpertBySlug(expertId));
  if (!expert) return [];

  const research = await getPublishedResearch();
  return research.filter((entry) => expert.researchIds?.includes(entry.id));
}

export async function getArticlesForExpert(expertId: string): Promise<Article[]> {
  const expert =
    (await getPublishedExpertById(expertId)) ??
    (await getPublishedExpertBySlug(expertId));
  if (!expert) return [];

  const articles = await getPublishedArticles();
  return articles.filter((article) => article.authorId === expert.id);
}

export function validateContentRelationships(): ContentRelationshipValidationIssue[] {
  return [];
}

export function assertContentRelationships() {
  const issues = validateContentRelationships();
  if (issues.length && process.env.NODE_ENV !== "production") {
    console.warn("Content relationship validation found issues:", issues);
  }
  return issues;
}

if (process.env.NODE_ENV !== "production") assertContentRelationships();
