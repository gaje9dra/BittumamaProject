export type ResearchStatus = "Published" | "Coming Soon";

export type ResearchEntry = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  date?: string;
  status?: ResearchStatus;
  type?: string;
  topic?: string;
  image?: string;
  href: string;
  featured?: boolean;
  tags?: string[];
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

export function getResearchCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `research-category-${slug}`;
}
