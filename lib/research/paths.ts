export function getResearchHref(research: { slug: string }) {
  return "/research/" + research.slug;
}

export function getResearchCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "research-category-" + slug;
}
