import type { Metadata } from "next";
import { ArticlesCta } from "@/components/articles/articles-cta";
import { ArticleArchive } from "@/components/articles/article-archive";
import { ArticleCategoryNav } from "@/components/articles/article-category-nav";
import { ArticleFeatured } from "@/components/articles/article-featured";
import { ArticlesIntro } from "@/components/articles/articles-intro";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedArticleCategories, getPublishedArticles } from "@/lib/articles/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Articles & Insights | Bittumama",
  description: "Research, ideas and practical insight from Bittumama.",
});

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  const categories = await getPublishedArticleCategories();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ArticlesIntro />
      <ArticleCategoryNav categories={categories} />
      <ArticleFeatured articles={articles} />
      <ArticleArchive articles={articles} categories={categories} />
      <ArticlesCta />
    </main>
  );
}
