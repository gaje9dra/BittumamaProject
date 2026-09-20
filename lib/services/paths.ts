export function getServiceHref(service: { slug: string }) {
  return "/services/" + service.slug;
}

export function getServiceCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "service-category-" + slug;
}
