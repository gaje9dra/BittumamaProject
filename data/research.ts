export type ResearchSeo = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
};

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
  date?: string;
  status?: ResearchStatus;
  type?: string;
  topic?: string;
  image?: string;
  featured?: boolean;
  tags?: string[];
};

export const researchEntries: ResearchEntry[] = [];

export function getAllResearch() {
  return researchEntries;
}

export function getResearchHref(research: Pick<ResearchEntry, "slug">) {
  return "/research/" + research.slug;
}

export function getResearchById(id: string) {
  return researchEntries.find((entry) => entry.id === id);
}

export function getResearchBySlug(slug: string) {
  return researchEntries.find((entry) => entry.slug === slug);
}

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

export function getRelatedResearch(entry: ResearchEntry) {
  return researchEntries.filter((candidate) => {
    if (candidate.id === entry.id || candidate.slug === entry.slug) return false;
    if (candidate.category !== entry.category) return false;
    if (!entry.tags?.length || !candidate.tags?.length) return false;

    return entry.tags.some((tag) => candidate.tags?.includes(tag));
  });
}

export function validateResearch(records: readonly ResearchEntry[] = researchEntries) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const research of records) {
    if (!research.id || !research.title || !research.slug) {
      throw new Error("Every research entry must have an id, title and slug.");
    }

    if (ids.has(research.id)) {
      throw new Error(`Duplicate research id: ${research.id}`);
    }
    ids.add(research.id);

    if (slugs.has(research.slug)) {
      throw new Error(`Duplicate research slug: ${research.slug}`);
    }
    slugs.add(research.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(research.slug)) {
      throw new Error(`Invalid research slug: ${research.slug}`);
    }
  }

  return true;
}

validateResearch();
