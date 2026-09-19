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
  relatedArticleIds?: string[];
  relatedResearchIds?: string[];
  relatedServiceIds?: string[];
  relatedExpertIds?: string[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
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
  const relatedIds = new Set(article.relatedArticleIds ?? []);
  return articles.filter(
    (candidate) => candidate.id !== article.id && relatedIds.has(candidate.id),
  );
}
