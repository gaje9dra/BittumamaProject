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
  };
};

export const articles: Article[] = [];

export const articleCategories = Array.from(
  new Set(articles.map((article) => article.category).filter(Boolean)),
);

export function getArticlesByCategory(category: string) {
  return articles.filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles() {
  return articles.filter((article) => article.featured);
}

export function getRelatedArticles(article: Article) {
  if (article.relatedArticles?.length) {
    return article.relatedArticles
      .map((slug) => getArticleBySlug(slug))
      .filter((item): item is Article => Boolean(item));
  }

  return articles.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.category === article.category &&
      Boolean(article.tags?.some((tag) => candidate.tags?.includes(tag))),
  );
}
