import { SEARCH_RESULT_TYPES, type SearchFilters, type SearchResultType } from "@/lib/search/types";

export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_MAX_QUERY_LENGTH = 160;
export const SEARCH_DEFAULT_PAGE_SIZE = 10;
export const SEARCH_MAX_PAGE_SIZE = 20;
export const SEARCH_MAX_PAGE = 100;

export function normalizeSearchQuery(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized || normalized.length < SEARCH_MIN_QUERY_LENGTH || normalized.length > SEARCH_MAX_QUERY_LENGTH) {
    return null;
  }
  return normalized;
}

export function parseSearchResultType(value: string | null | undefined): SearchResultType {
  return value && SEARCH_RESULT_TYPES.includes(value as SearchResultType)
    ? (value as SearchResultType)
    : "all";
}

export function parseSearchPage(value: string | null | undefined): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 && page <= SEARCH_MAX_PAGE ? page : 1;
}

export function parseSearchPageSize(value: string | null | undefined): number {
  if (!value || !/^\d+$/.test(value)) return SEARCH_DEFAULT_PAGE_SIZE;
  const pageSize = Number(value);
  return Number.isSafeInteger(pageSize) && pageSize >= 1 && pageSize <= SEARCH_MAX_PAGE_SIZE
    ? pageSize
    : SEARCH_DEFAULT_PAGE_SIZE;
}

export function parseSearchFilters(
  typeValue: string | null | undefined,
  pageValue: string | null | undefined,
  pageSizeValue: string | null | undefined,
): SearchFilters {
  return {
    type: parseSearchResultType(typeValue),
    page: parseSearchPage(pageValue),
    pageSize: parseSearchPageSize(pageSizeValue),
  };
}
