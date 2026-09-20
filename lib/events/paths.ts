export function getEventHref(event: { slug: string }) {
  return "/workshops/" + event.slug;
}

export function getEventCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "event-category-" + slug;
}
