-- Phase 8.20: PostgreSQL-native search infrastructure and search analytics event.
ALTER TYPE "AnalyticsEventName" ADD VALUE IF NOT EXISTS 'SEARCH_SUBMITTED';

CREATE INDEX "Service_search_fts_idx" ON "Service"
USING GIN (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("category", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("shortDescription", '')), 'C') ||
  setweight(to_tsvector('simple', coalesce("need", '') || ' ' || coalesce("focus", '')), 'D')
);

CREATE INDEX "ResearchItem_search_fts_idx" ON "ResearchItem"
USING GIN (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("category", '') || ' ' || coalesce("topic", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("shortDescription", '') || ' ' || coalesce("summary", '') || ' ' || coalesce("tags"::text, '') || ' ' || coalesce("topics"::text, '')), 'C')
);

CREATE INDEX "Expert_search_fts_idx" ON "Expert"
USING GIN (
  setweight(to_tsvector('simple', coalesce("name", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("role", '') || ' ' || coalesce("discipline", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("shortBio", '') || ' ' || coalesce("bio", '') || ' ' || coalesce("expertise"::text, '') || ' ' || coalesce("researchInterests"::text, '')), 'C')
);

CREATE INDEX "Article_search_fts_idx" ON "Article"
USING GIN (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("category", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("excerpt", '') || ' ' || coalesce("tags"::text, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce("content", '')), 'D')
);

CREATE INDEX "Event_search_fts_idx" ON "Event"
USING GIN (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("category", '') || ' ' || coalesce("location", '')), 'B') ||
  setweight(to_tsvector('simple', coalesce("shortDescription", '') || ' ' || coalesce("description", '') || ' ' || coalesce("audience"::text, '')), 'C')
);
