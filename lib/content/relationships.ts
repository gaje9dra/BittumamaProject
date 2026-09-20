import "server-only";

import type { Service } from "@/data/services";
import type { ResearchEntry } from "@/data/research";
import type { Expert } from "@/data/expertise";
import type { Article } from "@/data/articles";
import type { Event } from "@/data/events";
import { getPublishedArticles } from "@/lib/articles/repository";
import { getPublishedServiceById, getPublishedServiceBySlug, getPublishedServices } from "@/lib/services/repository";
import { getPublishedResearch, getPublishedResearchById, getPublishedResearchBySlug } from "@/lib/research/repository";
import { getPublishedExpertById, getPublishedExpertBySlug, getPublishedExperts } from "@/lib/experts/repository";
import { getPublishedEventById, getPublishedEvents } from "@/lib/events/repository";

async function resolveService(reference: string) {
  return (await getPublishedServiceById(reference)) ?? getPublishedServiceBySlug(reference);
}

async function resolveResearch(reference: string) {
  return (await getPublishedResearchById(reference)) ?? getPublishedResearchBySlug(reference);
}

async function resolveExpert(reference: string) {
  return (await getPublishedExpertById(reference)) ?? getPublishedExpertBySlug(reference);
}

export async function getRelatedResearchForService(serviceId: string): Promise<ResearchEntry[]> {
  const service = await resolveService(serviceId);
  if (!service) return [];
  const research = await getPublishedResearch();
  return research.filter((entry) =>
    entry.relatedServiceIds?.some((reference) => reference === service.id || reference === service.slug),
  );
}

export async function getRelatedServicesForResearch(research: ResearchEntry): Promise<Service[]> {
  const references = research.relatedServiceIds ?? [];
  if (!references.length) return [];
  const services = await getPublishedServices();
  const referenceSet = new Set(references);
  return services.filter((service) => referenceSet.has(service.id) || referenceSet.has(service.slug));
}

export async function getRelatedArticlesForResearch(researchId: string): Promise<Article[]> {
  const research = await resolveResearch(researchId);
  if (!research) return [];
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.relatedResearch?.includes(research.id));
}

export async function getRelatedExpertsForResearch(researchId: string): Promise<Expert[]> {
  const research = await resolveResearch(researchId);
  if (!research) return [];
  const experts = await getPublishedExperts();
  return experts.filter((expert) => expert.researchIds?.includes(research.id));
}

export async function getRelatedWorkshopsForResearch(researchId: string): Promise<Event[]> {
  const research = await resolveResearch(researchId);
  if (!research) return [];
  const events = await getPublishedEvents();
  return events.filter((event) => event.relatedResearchIds?.includes(research.id));
}

export async function getRelatedArticlesForService(serviceId: string): Promise<Article[]> {
  const service = await resolveService(serviceId);
  if (!service) return [];
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.relatedServices?.includes(service.id));
}

export async function getRelatedExpertsForService(serviceId: string): Promise<Expert[]> {
  const service = await resolveService(serviceId);
  if (!service) return [];
  const experts = await getPublishedExperts();
  return experts.filter((expert) => expert.serviceIds?.includes(service.id));
}

export async function getRelatedWorkshopsForService(serviceId: string): Promise<Event[]> {
  const service = await resolveService(serviceId);
  if (!service) return [];
  const events = await getPublishedEvents();
  return events.filter((event) => event.relatedServiceIds?.includes(service.id));
}

export async function getRelatedResearchForArticle(article: Article): Promise<ResearchEntry[]> {
  const references = article.relatedResearch ?? [];
  if (!references.length) return [];
  const research = await getPublishedResearch();
  const referenceSet = new Set(references);
  return research.filter((entry) => referenceSet.has(entry.id) || referenceSet.has(entry.slug));
}

export async function getRelatedServicesForArticle(article: Article): Promise<Service[]> {
  const references = article.relatedServices ?? [];
  if (!references.length) return [];
  const services = await getPublishedServices();
  const referenceSet = new Set(references);
  return services.filter((service) => referenceSet.has(service.id) || referenceSet.has(service.slug));
}

export async function getRelatedExpertsForArticle(article: Article): Promise<Expert[]> {
  const references = new Set<string>();
  if (article.authorId) references.add(article.authorId);
  if (article.authorSlug) references.add(article.authorSlug);
  for (const reference of article.expertIds ?? []) references.add(reference);
  if (!references.size) return [];
  const experts = await getPublishedExperts();
  return experts.filter((expert) => references.has(expert.id) || references.has(expert.slug));
}

export async function getRelatedResearchForExpert(expertId: string): Promise<ResearchEntry[]> {
  const expert = await resolveExpert(expertId);
  if (!expert) return [];
  const research = await getPublishedResearch();
  return research.filter((entry) => expert.researchIds?.includes(entry.id));
}

export async function getRelatedServicesForExpert(expertId: string): Promise<Service[]> {
  const expert = await resolveExpert(expertId);
  if (!expert) return [];
  const services = await getPublishedServices();
  return services.filter((service) => expert.serviceIds?.includes(service.id));
}

export async function getRelatedArticlesForExpert(expertId: string): Promise<Article[]> {
  const expert = await resolveExpert(expertId);
  if (!expert) return [];
  const articles = await getPublishedArticles();
  return articles.filter(
    (article) => article.authorId === expert.id || article.expertIds?.includes(expert.id),
  );
}

export async function getRelatedWorkshopsForExpert(expertId: string): Promise<Event[]> {
  const expert = await resolveExpert(expertId);
  if (!expert) return [];
  const events = await getPublishedEvents();
  return events.filter((event) => event.speakerId === expert.id);
}

export async function getRelatedExpertsForWorkshop(event: Event): Promise<Expert[]> {
  const speaker = event.speakerId
    ? await getPublishedExpertById(event.speakerId)
    : event.speakerSlug
      ? await getPublishedExpertBySlug(event.speakerSlug)
      : undefined;
  return speaker ? [speaker] : [];
}

export async function getRelatedResearchForWorkshop(event: Event): Promise<ResearchEntry[]> {
  const references = event.relatedResearchIds ?? [];
  if (!references.length) return [];
  const research = await getPublishedResearch();
  const referenceSet = new Set(references);
  return research.filter((entry) => referenceSet.has(entry.id) || referenceSet.has(entry.slug));
}

export async function getRelatedServicesForWorkshop(event: Event): Promise<Service[]> {
  const references = event.relatedServiceIds ?? [];
  if (!references.length) return [];
  const services = await getPublishedServices();
  const referenceSet = new Set(references);
  return services.filter((service) => referenceSet.has(service.id) || referenceSet.has(service.slug));
}

export async function getRelatedWorkshops(event: Event): Promise<Event[]> {
  const references = event.relatedEventIds ?? [];
  if (!references.length) return [];
  const events = await getPublishedEvents();
  const referenceSet = new Set(references);
  return events.filter(
    (candidate) =>
      candidate.id !== event.id &&
      (referenceSet.has(candidate.id) || referenceSet.has(candidate.slug)),
  );
}
