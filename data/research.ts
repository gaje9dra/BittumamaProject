export type ResearchStatus = "Published" | "Coming Soon";

export type ResearchPoint = {
  title: string;
  description: string;
};

export type ResearchMethodology = {
  approach: string;
  methods?: string[];
  sources?: string[];
  framework?: string;
};

export type ResearchSection = {
  id: string;
  title: string;
  intro?: string;
  content: string;
  keyPoints?: string[];
};

export type ResearchEntry = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  summary?: string;
  scope?: ResearchPoint[];
  topics?: ResearchPoint[];
  sections?: ResearchSection[];
  methodology?: ResearchMethodology;
  audience?: string[];
  highlights?: string[];
  relatedServiceIds?: string[];
  relatedArticleIds?: string[];
  relatedExpertIds?: string[];
  date?: string;
  status?: ResearchStatus;
  type?: string;
  topic?: string;
  image?: string;
  href: string;
  featured?: boolean;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
};

export const researchEntries: ResearchEntry[] = [];

export const researchCategories = Array.from(
  new Set(
    researchEntries
      .map((entry) => entry.category)
      .filter((category): category is string => Boolean(category)),
  ),
);

export function getResearchByCategory(category: string) {
  return researchEntries.filter((entry) => entry.category === category);
}

export function getFeaturedResearch() {
  return researchEntries.filter((entry) => entry.featured);
}

export function getResearchCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `research-category-${slug}`;
}

export function getResearchBySlug(slug: string) {
  return researchEntries.find((entry) => entry.slug === slug);
}

export function getRelatedResearch(entry: ResearchEntry) {
  const relatedIds = new Set(entry.relatedArticleIds ?? []);
  return researchEntries.filter(
    (candidate) =>
      candidate.id !== entry.id && relatedIds.has(candidate.id),
  );
}
