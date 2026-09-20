export type ArticleSection = {
  id: string;
  heading?: string;
  content: string;
  type?: "paragraph" | "list";
};

export type ArticleSeo = {
  title?: string;
  description?: string;
  image?: string;
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
  seo?: ArticleSeo;
};

// Migration-only Phase 7.5 canonical snapshot.
// Production Article reads come from PostgreSQL via lib/articles/repository.ts.
export const canonicalArticles: Article[] = [];

export function validateArticles(records: readonly Article[] = canonicalArticles) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const article of records) {
    if (!article.id || !article.title || !article.slug) {
      throw new Error("Every article must have an id, title and slug.");
    }
    if (ids.has(article.id)) throw new Error(`Duplicate article id: ${article.id}`);
    ids.add(article.id);
    if (slugs.has(article.slug)) throw new Error(`Duplicate article slug: ${article.slug}`);
    slugs.add(article.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid article slug: ${article.slug}`);
    }
  }
  return true;
}

validateArticles();
