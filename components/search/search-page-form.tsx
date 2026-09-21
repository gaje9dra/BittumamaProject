"use client";

import type { FormEvent } from "react";
import { trackClientEvent } from "@/lib/analytics/client";
import type { SearchResultType } from "@/lib/search/types";

export function SearchPageForm({ query, type, pageSize }: { query: string; type: SearchResultType; pageSize: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const input = event.currentTarget.elements.namedItem("q");
    const value = input instanceof HTMLInputElement ? input.value.trim().replace(/\s+/g, " ") : "";
    if (value.length >= 2 && value.length <= 160) {
      const queryLengthBucket = value.length <= 8 ? "short" : value.length <= 40 ? "medium" : "long";
      trackClientEvent({ eventName: "SEARCH_SUBMITTED", path: window.location.pathname, queryLengthBucket });
    }
  }

  return (
    <form action="/search" method="get" role="search" onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 lg:flex-row">
      <label htmlFor="search-page-query" className="sr-only">Search Bittumama content</label>
      <input
        id="search-page-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search research, articles, services..."
        className="min-h-12 min-w-0 flex-1 border border-input bg-background px-4 type-body outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        minLength={2}
        maxLength={160}
      />
      <input type="hidden" name="pageSize" value={pageSize} />
      {type !== "all" ? <input type="hidden" name="type" value={type} /> : null}
      <button type="submit" className="min-h-12 border border-primary bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2">
        Search
      </button>
    </form>
  );
}
