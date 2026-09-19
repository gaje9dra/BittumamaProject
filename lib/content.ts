import {
  articles,
  articleCategories,
  getArticleBySlug as getCanonicalArticleBySlug,
  type Article,
} from "@/data/articles";
import {
  events,
  eventCategories,
  getEventBySlug as getCanonicalEventBySlug,
  type Event,
} from "@/data/events";
import {
  expertDisciplines,
  experts,
  getExpertBySlug as getCanonicalExpertBySlug,
  type Expert,
} from "@/data/expertise";
import {
  researchCategories,
  researchEntries,
  getResearchBySlug as getCanonicalResearchBySlug,
  type ResearchEntry,
} from "@/data/research";
import {
  serviceCategories,
  services,
  getServiceBySlug as getCanonicalServiceBySlug,
  type Service,
} from "@/data/services";

export type { Article, Event, Expert, ResearchEntry, Service };

export const getAllServices = () => services;
export const getServiceBySlug = (slug: string) => getCanonicalServiceBySlug(slug);
export const getFeaturedServices = () => services.filter((service) => service.featured);

export const getAllResearch = () => researchEntries;
export const getResearchBySlug = (slug: string) => getCanonicalResearchBySlug(slug);
export const getFeaturedResearch = () => researchEntries.filter((entry) => entry.featured);

export const getAllExperts = () => experts;
export const getExpertBySlug = (slug: string) => getCanonicalExpertBySlug(slug);
export const getFeaturedExperts = () => experts.filter((expert) => expert.featured);

export const getAllArticles = () => articles;
export const getArticleBySlug = (slug: string) => getCanonicalArticleBySlug(slug);
export const getFeaturedArticles = () => articles.filter((article) => article.featured);
export const getLatestArticles = (limit?: number) => {
  const sorted = [...articles].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
};

export const getAllWorkshops = () => events;
export const getWorkshopBySlug = (slug: string) => getCanonicalEventBySlug(slug);
export const getFeaturedWorkshops = () => events.filter((event) => event.featured);
export const getUpcomingWorkshops = () => {
  const today = new Date().toISOString().slice(0, 10);
  return events
    .filter((event) => event.registrationStatus !== "Completed" && event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getServicesByIds = (ids: readonly string[]) => ids.map((id) => services.find((service) => service.id === id)).filter((service): service is Service => Boolean(service));
export const getResearchByIds = (ids: readonly string[]) => ids.map((id) => researchEntries.find((entry) => entry.id === id)).filter((entry): entry is ResearchEntry => Boolean(entry));
export const getExpertsByIds = (ids: readonly string[]) => ids.map((id) => experts.find((expert) => expert.id === id)).filter((expert): expert is Expert => Boolean(expert));
export const getArticlesByIds = (ids: readonly string[]) => ids.map((id) => articles.find((article) => article.id === id)).filter((article): article is Article => Boolean(article));
export const getWorkshopsByIds = (ids: readonly string[]) => ids.map((id) => events.find((event) => event.id === id)).filter((event): event is Event => Boolean(event));

export const getRelatedServices = (service: Service) => getServicesByIds(service.relatedServiceIds ?? []);
export const getRelatedResearch = (entry: ResearchEntry) => getResearchByIds(entry.relatedResearchIds ?? []);
export const getRelatedArticles = (article: Article) => getArticlesByIds(article.relatedArticleIds ?? []);
export const getExpertServices = (expert: Expert) => getServicesByIds(expert.serviceIds ?? []);
export const getExpertResearch = (expert: Expert) => getResearchByIds(expert.researchIds ?? []);
export const getExpertArticles = (expert: Expert) => getArticlesByIds(expert.articleIds ?? []);
export const getArticleAuthor = (article: Article) =>
  article.authorSlug ? getExpertBySlug(article.authorSlug) : undefined;
export const getEventRelatedWorkshops = (event: Event) => getWorkshopsByIds(event.relatedEventIds ?? []);

export { articleCategories, eventCategories, expertDisciplines, researchCategories, serviceCategories };
