export function getArticleHref(article: { slug: string }) {
  return "/articles/" + article.slug;
}

export function getArticleCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return "article-category-" + slug;
}
