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
  seo?: { title?: string; description?: string };
};

export const experts: Expert[] = [];

export const expertDisciplines = Array.from(
  new Set(
    experts.map((expert) => expert.discipline).filter((discipline): discipline is string => Boolean(discipline)),
  ),
);

export function getExpertsByDiscipline(discipline: string) {
  return experts.filter((expert) => expert.discipline === discipline);
}

export function getExpertBySlug(slug: string) {
  return experts.find((expert) => expert.slug === slug);
}

export function getFeaturedExperts() {
  return experts.filter((expert) => expert.featured);
}
