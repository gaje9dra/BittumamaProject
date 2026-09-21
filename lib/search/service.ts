import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { SearchResponse, SearchResult, SearchResultType } from "@/lib/search/types";
import {
  normalizeSearchQuery,
  SEARCH_MAX_PAGE_SIZE,
  SEARCH_MAX_PAGE,
} from "@/lib/search/validation";

type SearchRow = {
  id: string;
  contentType: Exclude<SearchResultType, "all">;
  title: string;
  description: string;
  href: string;
  publishedAt: Date;
  category: string | null;
  rank: number;
};

const TYPE_SQL: Record<Exclude<SearchResultType, "all">, string> = {
  services: "'services'",
  research: "'research'",
  experts: "'experts'",
  articles: "'articles'",
  workshops: "'workshops'",
};

const SEARCH_SQL = `
WITH candidates AS (
  SELECT
    s.id,
    'services'::text AS "contentType",
    s.title,
    s."shortDescription" AS description,
    '/services/' || s.slug AS href,
    COALESCE(s."publishAt", s."createdAt") AS "publishedAt",
    s.category,
    setweight(to_tsvector('simple', coalesce(s.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(s.category, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(s."shortDescription", '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(s.need, '') || ' ' || coalesce(s.focus, '')), 'D') AS search_vector
  FROM "Service" s
  WHERE s.status = 'PUBLISHED'
    AND (s."publishAt" IS NULL OR s."publishAt" <= CURRENT_TIMESTAMP)

  UNION ALL

  SELECT
    r.id,
    'research',
    r.title,
    COALESCE(r.summary, r."shortDescription"),
    '/research/' || r.slug,
    COALESCE(r."publishAt", r."createdAt"),
    r.category,
    setweight(to_tsvector('simple', coalesce(r.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(r.category, '') || ' ' || coalesce(r.topic, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(r."shortDescription", '') || ' ' || coalesce(r.summary, '') || ' ' || coalesce(r.tags::text, '') || ' ' || coalesce(r.topics::text, '')), 'C') AS search_vector
  FROM "ResearchItem" r
  WHERE r.status = 'PUBLISHED'
    AND (r."publishAt" IS NULL OR r."publishAt" <= CURRENT_TIMESTAMP)

  UNION ALL

  SELECT
    e.id,
    'experts',
    e.name,
    COALESCE(e."shortBio", e.bio, ''),
    '/experts/' || e.slug,
    COALESCE(e."publishAt", e."createdAt"),
    e.discipline,
    setweight(to_tsvector('simple', coalesce(e.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(e.role, '') || ' ' || coalesce(e.discipline, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(e."shortBio", '') || ' ' || coalesce(e.bio, '') || ' ' || coalesce(e.expertise::text, '') || ' ' || coalesce(e."researchInterests"::text, '')), 'C') AS search_vector
  FROM "Expert" e
  WHERE e.status = 'PUBLISHED'
    AND (e."publishAt" IS NULL OR e."publishAt" <= CURRENT_TIMESTAMP)

  UNION ALL

  SELECT
    a.id,
    'articles',
    a.title,
    COALESCE(a.excerpt, ''),
    '/articles/' || a.slug,
    COALESCE(a."publishAt", a."createdAt"),
    a.category,
    setweight(to_tsvector('simple', coalesce(a.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(a.category, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(a.excerpt, '') || ' ' || coalesce(a.tags::text, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(a.content, '')), 'D') AS search_vector
  FROM "Article" a
  WHERE a.status = 'PUBLISHED'
    AND (a."publishAt" IS NULL OR a."publishAt" <= CURRENT_TIMESTAMP)

  UNION ALL

  SELECT
    e.id,
    'workshops',
    e.title,
    e."shortDescription",
    '/workshops/' || e.slug,
    COALESCE(e."publishAt", e."createdAt"),
    e.category,
    setweight(to_tsvector('simple', coalesce(e.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(e.category, '') || ' ' || coalesce(e.location, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(e."shortDescription", '') || ' ' || coalesce(e.description, '') || ' ' || coalesce(e.audience::text, '')), 'C') AS search_vector
  FROM "Event" e
  WHERE e.status = 'PUBLISHED'
    AND (e."publishAt" IS NULL OR e."publishAt" <= CURRENT_TIMESTAMP)
)
SELECT
  id,
  "contentType",
  title,
  description,
  href,
  "publishedAt",
  category,
  (
    CASE WHEN lower(title) = lower($1) THEN 1000
         WHEN lower(title) LIKE lower($1 || '%') THEN 700
         WHEN lower(title) LIKE lower('%' || $1 || '%') THEN 500
         ELSE 0 END
    + ts_rank_cd(search_vector, websearch_to_tsquery('simple', $1), 32) * 100
  )::double precision AS rank
FROM candidates
WHERE (
  search_vector @@ websearch_to_tsquery('simple', $1)
  OR lower(title) LIKE lower('%' || $1 || '%')
)
`;

function typeClause(type: SearchResultType) {
  return type === "all" ? "" : ` AND "contentType" = ${TYPE_SQL[type]}`;
}

async function runSearchQuery(query: string, filters: { type: SearchResultType; offset: number; limit: number }) {
  const clause = typeClause(filters.type);
  const sql = `${SEARCH_SQL} ${clause} ORDER BY rank DESC, "publishedAt" DESC, id ASC LIMIT $2 OFFSET $3`;
  return prisma.client.$queryRawUnsafe<SearchRow[]>(sql, query, filters.limit, filters.offset);
}

async function countSearchResults(query: string, type: SearchResultType) {
  const clause = typeClause(type);
  const sql = `SELECT COUNT(*)::bigint AS count FROM (${SEARCH_SQL}) ranked WHERE 1=1 ${clause}`;
  const rows = await prisma.client.$queryRawUnsafe<Array<{ count: bigint }>>(sql, query);
  return Number(rows[0]?.count ?? BigInt(0));
}

export async function searchContent(input: {
  query: string;
  type?: SearchResultType;
  page?: number;
  pageSize?: number;
}): Promise<SearchResponse | null> {
  const query = normalizeSearchQuery(input.query);
  if (!query) return null;

  const type = input.type ?? "all";
  const pageSize = Math.min(Math.max(input.pageSize ?? 10, 1), SEARCH_MAX_PAGE_SIZE);
  const page = Math.min(Math.max(input.page ?? 1, 1), SEARCH_MAX_PAGE);
  const totalResults = await countSearchResults(query, type);
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const effectivePage = Math.min(page, totalPages);
  const rows = await runSearchQuery(query, {
    type,
    offset: (effectivePage - 1) * pageSize,
    limit: pageSize,
  });

  const results: SearchResult[] = rows.map((row) => ({
    id: row.id,
    contentType: row.contentType,
    title: row.title,
    description: row.description || "No description available.",
    href: row.href,
    publishedAt: row.publishedAt.toISOString(),
    ...(row.category ? { metadata: { category: row.category } } : {}),
    rank: row.rank,
  }));

  return {
    query,
    filters: { type, page: effectivePage, pageSize },
    results,
    pagination: {
      page: effectivePage,
      pageSize,
      totalResults,
      totalPages,
      hasPreviousPage: effectivePage > 1,
      hasNextPage: effectivePage < totalPages,
    },
  };
}
