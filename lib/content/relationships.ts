import type { Service } from "@/data/services";
import {
  getPublishedServiceById,
  getPublishedServiceBySlug,
} from "@/lib/services/repository";
import {
  getAllResearch,
  getResearchById,
  getResearchBySlug,
  type ResearchEntry,
} from "@/data/research";
import {
  getAllExperts,
  getExpertById,
  getExpertBySlug,
  type Expert,
} from "@/data/expertise";
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

function resolveByIdOrSlug<T extends { id: string; slug: string }>(
  reference: string,
  getById: (id: string) => T | undefined,
  getBySlug: (slug: string) => T | undefined,
) {
  return getById(reference) ?? getBySlug(reference);
}

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

  return getAllResearch().filter((research) =>
    research.relatedServiceIds?.some(
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

  return getAllExperts().filter((expert) => expert.serviceIds?.includes(service.id));
}

export function getArticlesForResearch(researchId: string): Article[] {
  const research =
    getResearchById(researchId) ?? getResearchBySlug(researchId);
  if (!research) return [];

  return getAllArticles().filter((article) =>
    article.relatedResearch?.some(
      (reference) =>
        reference === research.id || reference === research.slug,
    ),
  );
}

export function getExpertsForResearch(researchId: string): Expert[] {
  const research =
    getResearchById(researchId) ?? getResearchBySlug(researchId);
  if (!research) return [];

  return getAllExperts().filter((expert) =>
    expert.researchIds?.includes(research.id),
  );
}

export function getExpertForArticle(article: Article): Expert | undefined {
  if (article.authorId) {
    const expert = getExpertById(article.authorId);
    if (expert) return expert;
  }
  if (article.authorSlug) return getExpertBySlug(article.authorSlug);
  return undefined;
}

export function getResearchForArticle(article: Article): ResearchEntry[] {
  return (article.relatedResearch ?? [])
    .map((reference) =>
      resolveByIdOrSlug(reference, getResearchById, getResearchBySlug),
    )
    .filter((item): item is ResearchEntry => Boolean(item));
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

export function getExpertForWorkshop(event: Event): Expert | undefined {
  if (event.speakerId) return getExpertById(event.speakerId);
  if (event.speakerSlug) return getExpertBySlug(event.speakerSlug);
  return undefined;
}

export function getResearchForWorkshop(event: Event): ResearchEntry[] {
  return (event.relatedResearchIds ?? [])
    .map((reference) =>
      resolveByIdOrSlug(reference, getResearchById, getResearchBySlug),
    )
    .filter((item): item is ResearchEntry => Boolean(item));
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
  const expert = getExpertById(expertId) ?? getExpertBySlug(expertId);
  if (!expert) return [];

  const services = await Promise.all(
    (expert.serviceIds ?? []).map((id) => getPublishedServiceById(id)),
  );
  return services.filter((item): item is Service => Boolean(item));
}

export function getResearchForExpert(expertId: string): ResearchEntry[] {
  const expert = getExpertById(expertId) ?? getExpertBySlug(expertId);
  if (!expert) return [];

  return (expert.researchIds ?? [])
    .map((id) => getResearchById(id))
    .filter((item): item is ResearchEntry => Boolean(item));
}

export function getArticlesForExpert(expertId: string): Article[] {
  const expert = getExpertById(expertId) ?? getExpertBySlug(expertId);
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

  for (const expert of getAllExperts()) {
    for (const reference of expert.researchIds ?? []) {
      if (!getResearchById(reference) && !getResearchBySlug(reference)) {
        add("expert", expert.id, "researchIds", reference, "Referenced Research does not exist.");
      }
    }
    for (const reference of expert.articleIds ?? []) {
      if (!getArticleById(reference) && !getArticleBySlug(reference)) {
        add("expert", expert.id, "articleIds", reference, "Referenced Article does not exist.");
      }
    }
  }

  for (const article of getAllArticles()) {
    if (
      (article.authorId || article.authorSlug) &&
      !getExpertForArticle(article)
    ) {
      add(
        "article",
        article.id,
        "author",
        article.authorId ?? article.authorSlug ?? "",
        "Referenced Expert does not exist.",
      );
    }
    for (const reference of article.relatedResearch ?? []) {
      if (!getResearchById(reference) && !getResearchBySlug(reference)) {
        add("article", article.id, "relatedResearch", reference, "Referenced Research does not exist.");
      }
    }
  }

  for (const event of getAllEvents()) {
    if (
      (event.speakerId || event.speakerSlug) &&
      !getExpertForWorkshop(event)
    ) {
      add(
        "event",
        event.id,
        "speaker",
        event.speakerId ?? event.speakerSlug ?? "",
        "Referenced Expert does not exist.",
      );
    }
    for (const reference of event.relatedResearchIds ?? []) {
      if (!getResearchById(reference) && !getResearchBySlug(reference)) {
        add("event", event.id, "relatedResearchIds", reference, "Referenced Research does not exist.");
      }
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
