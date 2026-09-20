export function getExpertHref(expert: { slug: string }) {
  return "/experts/" + expert.slug;
}

export function getExpertDisciplineAnchor(discipline: string) {
  const slug = discipline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "expert-discipline-" + slug;
}
