import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SearchPageForm } from "@/components/search/search-page-form";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { searchContent } from "@/lib/search/service";
import { normalizeSearchQuery, parseSearchFilters } from "@/lib/search/validation";
import { SEARCH_RESULT_TYPES, type SearchResultType } from "@/lib/search/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Search | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};
type SearchPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
function one(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
const labels: Record<SearchResultType, string> = {
  all: "All", services: "Services", research: "Research", experts: "Experts", articles: "Articles", workshops: "Workshops & Events",
};
function searchHref(query: string, type: SearchResultType, page: number, pageSize: number) {
  const params = new URLSearchParams();
  params.set("q", query);
  if (type !== "all") params.set("type", type);
  if (page > 1) params.set("page", String(page));
  if (pageSize !== 10) params.set("pageSize", String(pageSize));
  return "/search?" + params.toString();
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = one(params.q);
  const normalizedQuery = normalizeSearchQuery(rawQuery);
  const filters = parseSearchFilters(one(params.type), one(params.page), one(params.pageSize));
  const result = normalizedQuery ? await searchContent({ query: normalizedQuery, ...filters }) : null;
  const invalidQuery = Boolean(rawQuery && !normalizedQuery);
  const hasQuery = Boolean(rawQuery);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-lg">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="type-label text-muted-foreground">Search</p>
            <Heading level={1} className="mt-3">Search Bittumama</Heading>
            <Text size="lg" className="mt-4 text-muted-foreground">
              {result ? `Results for “${result.query}”` : invalidQuery ? "Use 2–160 characters for a search." : "Search published services, research, experts, articles, and workshops."}
            </Text>
          </div>
          <SearchPageForm query={rawQuery ?? ""} type={filters.type} pageSize={filters.pageSize} />
          <nav aria-label="Filter search results" className="mt-6 flex flex-wrap gap-2">
            {SEARCH_RESULT_TYPES.map((type) => (
              <Link key={type} href={result ? searchHref(result.query, type, 1, filters.pageSize) : searchHref(normalizedQuery ?? "", type, 1, filters.pageSize)} aria-current={filters.type === type ? "page" : undefined} className={`inline-flex min-h-10 items-center border px-3 type-caption transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${filters.type === type ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-surface-muted"}`}>
                {labels[type]}
              </Link>
            ))}
          </nav>
          {result ? (
            <div className="mt-8">
              <p className="type-caption text-muted-foreground" aria-live="polite">{result.pagination.totalResults} {result.pagination.totalResults === 1 ? "result" : "results"}</p>
              {result.results.length ? (
                <ol className="mt-3 divide-y divide-border border-y border-border">
                  {result.results.map((item) => (
                    <li key={item.contentType + ":" + item.id} className="py-5">
                      <Link href={item.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4">
                        <p className="type-label text-muted-foreground">{labels[item.contentType]}</p>
                        <h2 className="mt-1 type-h4 group-hover:underline group-focus-visible:underline">{item.title}</h2>
                        <p className="mt-2 max-w-3xl type-body-sm text-muted-foreground">{item.description}</p>
                        {item.metadata?.category ? <p className="mt-2 type-caption text-muted-foreground">{item.metadata.category}</p> : null}
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="border-y border-border py-10" role="status"><Heading level={2}>No results</Heading><Text className="mt-2 text-muted-foreground">Try a different term or browse the content sections.</Text></div>
              )}
              {result.pagination.totalPages > 1 ? (
                <nav aria-label="Search pagination" className="mt-6 flex items-center justify-between gap-4">
                  {result.pagination.hasPreviousPage ? <Link href={searchHref(result.query, filters.type, result.pagination.page - 1, filters.pageSize)} className="min-h-11 border border-border px-4 inline-flex items-center type-button hover:bg-surface-muted">Previous</Link> : <span />}
                  <span className="type-caption text-muted-foreground">Page {result.pagination.page} of {result.pagination.totalPages}</span>
                  {result.pagination.hasNextPage ? <Link href={searchHref(result.query, filters.type, result.pagination.page + 1, filters.pageSize)} className="min-h-11 border border-border px-4 inline-flex items-center type-button hover:bg-surface-muted">Next</Link> : <span />}
                </nav>
              ) : null}
            </div>
          ) : hasQuery && invalidQuery ? (
            <div className="mt-8 border-y border-border py-10" role="alert"><Heading level={2}>Search query is not valid</Heading><Text className="mt-2 text-muted-foreground">Use 2–160 characters and try again.</Text></div>
          ) : null}
        </Container>
      </section>
    </main>
  );
}
