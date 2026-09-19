import {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  type Service,
} from "@/data/services";
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

export function getResearchForService(serviceId: string): ResearchEntry[] {
  const service = getServiceById(serviceId);
  if (!service) return [];

  return getAllResearch().filter((research) =>
    research.relatedServiceIds?.includes(service.id),
  );
}

export function getArticlesForService(serviceId: string): Article[] {
  const service = getServiceById(serviceId);
  if (!service) return [];

  return getAllArticles().filter((article) =>
    article.relatedServices?.some(
      (reference) =>
        reference === service.id || reference === service.slug,
    ),
  );
}

export function getExpertsForService(serviceId: string): Expert[] {
  const service = getServiceById(serviceId);
  if (!service) return [];

  return getAllExperts().filter((expert) =>
    expert.serviceIds?.includes(service.id),
  );
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
  if (article.authorId) return getExpertById(article.authorId);
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

export function getServicesForArticle(article: Article): Service[] {
  return (article.relatedServices ?? [])
    .map((reference) =>
      resolveByIdOrSlug(reference, getServiceById, getServiceBySlug),
    )
    .filter((item): item is Service => Boolean(item));
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

export function getServicesForWorkshop(event: Event): Service[] {
  return (event.relatedServiceIds ?? [])
    .map((reference) =>
      resolveByIdOrSlug(reference, getServiceById, getServiceBySlug),
    )
    .filter((item): item is Service => Boolean(item));
}

export function getServicesForExpert(expertId: string): Service[] {
  const expert = getExpertById(expertId) ?? getExpertBySlug(expertId);
  if (!expert) return [];

  return (expert.serviceIds ?? [])
    .map((id) => getServiceById(id))
    .filter((item): item is Service => Boolean(item));
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

  const references = new Set([expert.id, expert.slug]);

  return getAllArticles().filter(
    (article) =>
      article.authorId === expert.id ||
      article.authorSlug === expert.slug ||
      article.authorId === expert.slug ||
      article.authorSlug === expert.id ||
      article.relatedServices?.some((reference) => references.has(reference)) === false,
  ).filter((article) =>
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

  for (const research of getAllResearch()) {
    for (const reference of research.relatedServiceIds ?? []) {
      if (!getServiceById(reference) && !getServiceBySlug(reference)) {
        add("research", research.id, "relatedServiceIds", reference, "Referenced Service does not exist.");
      }
    }
  }

  for (const expert of getAllExperts()) {
    for (const reference of expert.serviceIds ?? []) {
      if (!getServiceById(reference) && !getServiceBySlug(reference)) {
        add("expert", expert.id, "serviceIds", reference, "Referenced Service does not exist.");
      }
    }
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
    if (article.authorId && !getExpertById(article.authorId)) {
      add("article", article.id, "authorId", article.authorId, "Referenced Expert does not exist.");
    }
    if (article.authorSlug && !getExpertBySlug(article.authorSlug)) {
      add("article", article.id, "authorSlug", article.authorSlug, "Referenced Expert does not exist.");
    }
    for (const reference of article.relatedResearch ?? []) {
      if (!getResearchById(reference) && !getResearchBySlug(reference)) {
        add("article", article.id, "relatedResearch", reference, "Referenced Research does not exist.");
      }
    }
    for (const reference of article.relatedServices ?? []) {
      if (!getServiceById(reference) && !getServiceBySlug(reference)) {
        add("article", article.id, "relatedServices", reference, "Referenced Service does not exist.");
      }
    }
  }

  for (const event of getAllEvents()) {
    if (event.speakerId && !getExpertById(event.speakerId)) {
      add("event", event.id, "speakerId", event.speakerId, "Referenced Expert does not exist.");
    }
    if (event.speakerSlug && !getExpertBySlug(event.speakerSlug)) {
      add("event", event.id, "speakerSlug", event.speakerSlug, "Referenced Expert does not exist.");
    }
    for (const reference of event.relatedResearchIds ?? []) {
      if (!getResearchById(reference) && !getResearchBySlug(reference)) {
        add("event", event.id, "relatedResearchIds", reference, "Referenced Research does not exist.");
      }
    }
    for (const reference of event.relatedServiceIds ?? []) {
      if (!getServiceById(reference) && !getServiceBySlug(reference)) {
        add("event", event.id, "relatedServiceIds", reference, "Referenced Service does not exist.");
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
