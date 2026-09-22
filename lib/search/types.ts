import type { SearchResultType } from "@/lib/search/client-types";

export { SEARCH_RESULT_TYPES, type SearchResultType } from "@/lib/search/client-types";
export type SearchFilters = {
  type: SearchResultType;
  page: number;
  pageSize: number;
};

export type SearchResult = {
  id: string;
  contentType: Exclude<SearchResultType, "all">;
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  metadata?: {
    category?: string;
  };
  rank: number;
};

export type SearchPagination = {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type SearchResponse = {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  pagination: SearchPagination;
};

export type SearchAnalyticsEvent = {
  eventName: "SEARCH_SUBMITTED";
  path: string;
  queryLengthBucket: "short" | "medium" | "long";
};

