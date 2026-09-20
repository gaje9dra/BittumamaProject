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

export const experts: Expert[] = [];

export function getAllExperts() {
  return experts;
}

export function getExpertHref(expert: Pick<Expert, "slug">) {
  return "/experts/" + expert.slug;
}

export function getExpertById(id: string) {
  return experts.find((expert) => expert.id === id);
}

export function getExpertBySlug(slug: string) {
  return experts.find((expert) => expert.slug === slug);
}

export function getFeaturedExperts() {
  return experts.filter((expert) => expert.featured);
}

export const expertDisciplines = Array.from(
  new Set(
    experts
      .map((expert) => expert.discipline)
      .filter((discipline): discipline is string => Boolean(discipline)),
  ),
);

export function getExpertsByDiscipline(discipline: string) {
  return experts.filter((expert) => expert.discipline === discipline);
}

export function getExpertDisciplineAnchor(discipline: string) {
  const slug = discipline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "expert-discipline-" + slug;
}

export function validateExperts(records: readonly Expert[] = experts) {
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
