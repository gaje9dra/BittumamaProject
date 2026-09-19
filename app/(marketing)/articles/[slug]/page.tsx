import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { articles, getArticleBySlug } from "@/data/articles";

type ArticleDetailRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found | Bittumama" };

  return {
    title: article.seo?.title ?? article.title + " | Articles & Insights | Bittumama",
    description: article.seo?.description ?? article.excerpt,
    alternates: { canonical: "/articles/" + article.slug },
  };
}

export default async function ArticleDetailRoute({ params }: ArticleDetailRouteProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetailPage article={article} />;
}
