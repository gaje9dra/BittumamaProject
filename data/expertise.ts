export type ExpertSeo = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
};

export type Expert = {
  id: string;
  name: string;
  slug: string;
  role?: string;
  discipline?: string;
  shortBio?: string;
  bio?: string;
  image?: string;
  expertise?: string[];
  qualifications?: string[];
  researchInterests?: string[];
  serviceIds?: string[];
  researchIds?: string[];
  articleIds?: string[];
  featured?: boolean;
  seo?: ExpertSeo;
};

// Migration-only Phase 7.4 canonical snapshot.
// Production Expert reads come from PostgreSQL via lib/experts/repository.ts.
export const canonicalExperts: Expert[] = [];

export function validateExperts(records: readonly Expert[] = canonicalExperts) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const expert of records) {
    if (!expert.id || !expert.name || !expert.slug) {
      throw new Error("Every expert must have an id, name and slug.");
    }

    if (ids.has(expert.id)) {
      throw new Error(`Duplicate expert id: ${expert.id}`);
    }
    ids.add(expert.id);

    if (slugs.has(expert.slug)) {
      throw new Error(`Duplicate expert slug: ${expert.slug}`);
    }
    slugs.add(expert.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expert.slug)) {
      throw new Error(`Invalid expert slug: ${expert.slug}`);
    }
  }

  return true;
}

validateExperts();
