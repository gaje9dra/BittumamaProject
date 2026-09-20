import type { Service } from "@/data/services";
import {
  getPublishedServiceById,
  getPublishedServiceBySlug,
} from "@/lib/services/repository";
import {
  getPublishedResearch,
  getPublishedResearchById,
  getPublishedResearchBySlug,
} from "@/lib/research/repository";
import { getPublishedExpertById, getPublishedExpertBySlug } from "@/lib/experts/repository";
import type { ResearchEntry } from "@/data/research";
import type { Expert } from "@/data/expertise";
import {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  type Article,
} from "@/data/articles";
import {
  getAllEvents,
  getEventById,
  getEventBySlug,
  type Event,
} from "@/data/events";

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

  return getAllArticles().filter((article) =>
    article.relatedServices?.some(
      (reference) => reference === service.id || reference === service.slug,
    ),
  );
}

export async function getExpertsForService(serviceId: string): Promise<Expert[]> {
  const service =
    (await getPublishedServiceById(serviceId)) ??
    (await getPublishedServiceBySlug(serviceId));
  if (!service) return [];

  const experts = await import("@/lib/experts/repository").then((module) => module.getPublishedExperts());
  return experts.filter((expert) => expert.serviceIds?.includes(service.id));
}

export async function getArticlesForResearch(researchId: string): Promise<Article[]> {
  const research =
    (await getPublishedResearchById(researchId)) ??
    (await getPublishedResearchBySlug(researchId));
  if (!research) return [];

  return getAllArticles().filter((article) =>
    article.relatedResearch?.some(
      (reference) =>
        reference === research.id || reference === research.slug,
    ),
  );
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

export function getArticlesForExpert(expertId: string): Article[] {
  const expert =
    (await getPublishedExpertById(expertId)) ??
    (await getPublishedExpertBySlug(expertId));
  if (!expert) return [];

  return getAllArticles().filter(
    (article) =>
      article.authorId === expert.id ||
      article.authorSlug === expert.slug ||
      article.authorId === expert.slug ||
      article.authorSlug === expert.id ||
      expert.articleIds?.includes(article.id) === true,
  );
}

export function validateContentRelationships(): ContentRelationshipValidationIssue[] {
  const issues: ContentRelationshipValidationIssue[] = [];

  const add = (
    sourceType: ContentRelationshipValidationIssue["sourceType"],
    sourceId: string,
    relation: string,
    reference: string,
    message: string,
  ) => issues.push({ sourceType, sourceId, relation, reference, message });

  // Research is now database-backed. Research relationship integrity is verified by
  // prisma/verify-research.ts; the remaining static domains are validated here.
  for (const expert of getAllExperts()) {
    for (const reference of expert.articleIds ?? []) {
      if (!getArticleById(reference) && !getArticleBySlug(reference)) {
        add("expert", expert.id, "articleIds", reference, "Referenced Article does not exist.");
      }
    }
  }

  for (const article of getAllArticles()) {
    if ((article.authorId || article.authorSlug) && !getExpertForArticle(article)) {
      add(
        "article",
        article.id,
        "author",
        article.authorId ?? article.authorSlug ?? "",
        "Referenced Expert does not exist.",
      );
    }
  }

  for (const event of getAllEvents()) {
    if ((event.speakerId || event.speakerSlug) && !getExpertForWorkshop(event)) {
      add(
        "event",
        event.id,
        "speaker",
        event.speakerId ?? event.speakerSlug ?? "",
        "Referenced Expert does not exist.",
      );
    }
    for (const reference of event.relatedEventIds ?? []) {
      if (!getEventById(reference) && !getEventBySlug(reference)) {
        add("event", event.id, "relatedEventIds", reference, "Referenced Event does not exist.");
      }
    }
  }

  return issues;
}

export function assertContentRelationships() {
  const issues = validateContentRelationships();

  if (issues.length && process.env.NODE_ENV !== "production") {
    console.warn("Content relationship validation found issues:", issues);
  }

  return issues;
}

if (process.env.NODE_ENV !== "production") {
  assertContentRelationships();
}
