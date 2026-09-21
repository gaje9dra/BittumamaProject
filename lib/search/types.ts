import type { AnalyticsContentType } from "@/generated/prisma/client";

export const SEARCH_RESULT_TYPES = ["all", "services", "research", "experts", "articles", "workshops"] as const;
export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];

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

export type SearchAnalyticsContentType = AnalyticsContentType;
