import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { getAllArticles, getArticleBySlug, getArticleHref } from "@/data/articles";
import { createContentMetadata } from "@/lib/metadata";

type ArticleDetailRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found | Bittumama" };

  return createContentMetadata({
    seo: article.seo,
    title: article.title,
    description: article.excerpt,
    image: article.image,
    canonical: getArticleHref(article),
  });
}

export default async function ArticleDetailRoute({ params }: ArticleDetailRouteProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetailPage article={article} />;
}
