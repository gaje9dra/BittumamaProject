export type ArticleSection = {
  id: string;
  heading?: string;
  content: string;
  type?: "paragraph" | "list";
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date?: string;
  author?: string;
  authorId?: string;
  authorRole?: string;
  authorSlug?: string;
  excerpt?: string;
  content?: string;
  sections?: ArticleSection[];
  image?: string;
  featured?: boolean;
  tags?: string[];
  relatedArticles?: string[];
  relatedResearch?: string[];
  relatedServices?: string[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export const articles: Article[] = [];

export function getAllArticles() {
  return articles;
}

export function getArticleHref(article: Pick<Article, "slug">) {
  return "/articles/" + article.slug;
}

export const articleCategories = Array.from(
  new Set(articles.map((article) => article.category).filter(Boolean)),
);

export function getArticleById(id: string) {
  return articles.find((article) => article.id === id);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles() {
  return articles.filter((article) => article.featured);
}

export function getArticlesByCategory(category: string) {
  return articles.filter((article) => article.category === category);
}

export function getArticleCategoryAnchor(category: string) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `article-category-${slug}`;
}

export function getRelatedArticles(article: Article) {
  if (article.relatedArticles?.length) {
    return article.relatedArticles
      .map((idOrSlug) => getArticleById(idOrSlug) ?? getArticleBySlug(idOrSlug))
      .filter((item): item is Article => Boolean(item));
  }

  return articles.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.category === article.category &&
      Boolean(article.tags?.some((tag) => candidate.tags?.includes(tag))),
  );
}

export function validateArticles(records: readonly Article[] = articles) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const article of records) {
    if (!article.id || !article.title || !article.slug) {
      throw new Error("Every article must have an id, title and slug.");
    }

    if (ids.has(article.id)) {
      throw new Error(`Duplicate article id: ${article.id}`);
    }
    ids.add(article.id);

    if (slugs.has(article.slug)) {
      throw new Error(`Duplicate article slug: ${article.slug}`);
    }
    slugs.add(article.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid article slug: ${article.slug}`);
    }
  }

  return true;
}

validateArticles();
