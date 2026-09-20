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
  expertIds?: string[];
  relatedArticleIds?: string[];
  relatedWorkshopIds?: string[];
  date?: string;
  status?: ResearchStatus;
  type?: string;
  topic?: string;
  image?: string;
  featured?: boolean;
  tags?: string[];
  seo?: ResearchSeo;
};

// Migration-only Phase 7.3 canonical snapshot.
// Production Research reads come from PostgreSQL via lib/research/repository.ts.
export const canonicalResearchEntries: ResearchEntry[] = [];

export function validateResearch(records: readonly ResearchEntry[] = canonicalResearchEntries) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const research of records) {
    if (!research.id || !research.title || !research.slug) {
      throw new Error("Every research entry must have an id, title and slug.");
    }
    if (ids.has(research.id)) throw new Error(`Duplicate research id: ${research.id}`);
    ids.add(research.id);
    if (slugs.has(research.slug)) throw new Error(`Duplicate research slug: ${research.slug}`);
    slugs.add(research.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(research.slug)) {
      throw new Error(`Invalid research slug: ${research.slug}`);
    }
  }
  return true;
}

validateResearch();
