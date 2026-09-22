export const SEARCH_RESULT_TYPES = ["all", "services", "research", "experts", "articles", "workshops"] as const;
export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];
