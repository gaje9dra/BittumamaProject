# Phase 8.20 — Search Infrastructure

Phase 8.20 adds one canonical, server-side search service for the published Services, Research, Experts, Articles, and Workshops/Events domains.

## Search strategy

Search uses PostgreSQL full-text search with the `simple` configuration and weighted `tsvector` expressions. GIN indexes are created for the same canonical fields used by the search service. A bounded title `ILIKE` fallback supports practical partial title matching when a token is not a full-text match.

The ranking hierarchy is deterministic: exact title match, title prefix, title substring, then PostgreSQL `ts_rank_cd` using weighted fields. Ties use publication time and stable ID ordering.

## Searchable fields

- Services: title, category, short description, need, focus.
- Research: title, category, topic, short description, summary, tags, topics.
- Experts: name, role, discipline, short bio, bio, expertise, research interests.
- Articles: title, category, excerpt, tags, content.
- Workshops/Events: title, category, location, short description, description, audience.

Private inquiries, payments, notifications, authentication data, admin notes, and other user-private fields are not searchable.

## Public publishing isolation

Each domain query requires `status = PUBLISHED` and either a null `publishAt` or a publication time at or before the current database time. Draft, scheduled-unpublished, and archived records therefore cannot enter public search. Secure preview remains outside this public service.

## Route and filters

The existing `/search` route is now production-backed and remains URL-addressable:

`/search?q=research&type=articles&page=2&pageSize=10`

Supported content filters are All, Services, Research, Experts, Articles, and Workshops & Events. Query length is bounded to 2–160 characters; page numbers and page sizes are bounded.

## Pagination and performance

The search service performs bounded SQL queries and an exact database count; it never loads the searchable dataset into application memory. Public page size is capped at 20 and page numbers are capped at 100. Search vectors are indexed with PostgreSQL GIN indexes.

The search page is server-rendered and dynamic because results must reflect current publication state. No separate search cache is introduced, so publishing changes are visible without a stale public-search cache. No global cache invalidation is required.

## Analytics and privacy

Search submissions use the existing Phase 8.19 analytics pipeline. Only a query-length bucket (short, medium, long) is recorded; the raw search term is not stored. Analytics failures remain non-blocking.

## Security

User input is normalized and length-bounded. PostgreSQL full-text parsing uses `websearch_to_tsquery` with parameter binding. Search type, page, and page size are allowlisted/bounded. The result shape contains only public UI fields.

## Verification

Run `npm run search:verify` against a configured PostgreSQL database. The verification script checks cross-domain search, publication isolation, type filtering, pagination, normalization, bounds, and injection-like input handling.

No third-party search provider, vector database, embeddings, or AI search system is introduced.
