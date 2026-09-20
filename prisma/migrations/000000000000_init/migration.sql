CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ServiceAvailability" AS ENUM ('AVAILABLE', 'COMING_SOON');
CREATE TYPE "EventRegistrationStatus" AS ENUM ('REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'COMING_SOON', 'COMPLETED');
CREATE TYPE "EventFormat" AS ENUM ('ONLINE', 'IN_PERSON', 'HYBRID');

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "need" TEXT,
    "focus" TEXT,
    "audience" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "availability" "ServiceAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "seoCanonical" TEXT,
    "seoNoIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResearchItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "summary" TEXT,
    "date" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "type" TEXT,
    "topic" TEXT,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "audience" JSONB,
    "scope" JSONB,
    "topics" JSONB,
    "sections" JSONB,
    "methodology" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "seoCanonical" TEXT,
    "seoNoIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ResearchItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Expert" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "discipline" TEXT,
    "shortBio" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "expertise" JSONB,
    "qualifications" JSONB,
    "researchInterests" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "seoCanonical" TEXT,
    "seoNoIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Expert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "excerpt" TEXT,
    "content" TEXT,
    "sections" JSONB,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "time" TEXT,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "format" "EventFormat",
    "shortDescription" TEXT NOT NULL,
    "description" TEXT,
    "audience" JSONB,
    "speakerId" TEXT,
    "speakerRole" TEXT,
    "image" TEXT,
    "registrationLabel" TEXT,
    "registrationHref" TEXT,
    "registrationStatus" "EventRegistrationStatus",
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResearchService" (
    "researchId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "ResearchService_pkey" PRIMARY KEY ("researchId", "serviceId")
);

CREATE TABLE "ExpertResearch" (
    "expertId" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    CONSTRAINT "ExpertResearch_pkey" PRIMARY KEY ("expertId", "researchId")
);

CREATE TABLE "ArticleResearch" (
    "articleId" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    CONSTRAINT "ArticleResearch_pkey" PRIMARY KEY ("articleId", "researchId")
);

CREATE TABLE "ArticleService" (
    "articleId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "ArticleService_pkey" PRIMARY KEY ("articleId", "serviceId")
);

CREATE TABLE "ArticleExpert" (
    "articleId" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    CONSTRAINT "ArticleExpert_pkey" PRIMARY KEY ("articleId", "expertId")
);

CREATE TABLE "ArticleRelation" (
    "sourceArticleId" TEXT NOT NULL,
    "targetArticleId" TEXT NOT NULL,
    CONSTRAINT "ArticleRelation_pkey" PRIMARY KEY ("sourceArticleId", "targetArticleId")
);

CREATE TABLE "WorkshopResearch" (
    "eventId" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    CONSTRAINT "WorkshopResearch_pkey" PRIMARY KEY ("eventId", "researchId")
);

CREATE TABLE "WorkshopService" (
    "eventId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "WorkshopService_pkey" PRIMARY KEY ("eventId", "serviceId")
);

CREATE TABLE "EventRelation" (
    "sourceEventId" TEXT NOT NULL,
    "targetEventId" TEXT NOT NULL,
    CONSTRAINT "EventRelation_pkey" PRIMARY KEY ("sourceEventId", "targetEventId")
);

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_status_idx" ON "Service"("status");
CREATE INDEX "Service_category_idx" ON "Service"("category");

CREATE UNIQUE INDEX "ResearchItem_slug_key" ON "ResearchItem"("slug");
CREATE INDEX "ResearchItem_status_idx" ON "ResearchItem"("status");
CREATE INDEX "ResearchItem_category_idx" ON "ResearchItem"("category");
CREATE INDEX "ResearchItem_date_idx" ON "ResearchItem"("date");

CREATE UNIQUE INDEX "Expert_slug_key" ON "Expert"("slug");
CREATE INDEX "Expert_status_idx" ON "Expert"("status");
CREATE INDEX "Expert_discipline_idx" ON "Expert"("discipline");

CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_status_idx" ON "Article"("status");
CREATE INDEX "Article_category_idx" ON "Article"("category");
CREATE INDEX "Article_date_idx" ON "Article"("date");
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Event_category_idx" ON "Event"("category");
CREATE INDEX "Event_date_idx" ON "Event"("date");
CREATE INDEX "Event_speakerId_idx" ON "Event"("speakerId");

CREATE INDEX "ResearchService_serviceId_idx" ON "ResearchService"("serviceId");
CREATE INDEX "ExpertResearch_researchId_idx" ON "ExpertResearch"("researchId");
CREATE INDEX "ArticleResearch_researchId_idx" ON "ArticleResearch"("researchId");
CREATE INDEX "ArticleService_serviceId_idx" ON "ArticleService"("serviceId");
CREATE INDEX "ArticleExpert_expertId_idx" ON "ArticleExpert"("expertId");
CREATE INDEX "ArticleRelation_targetArticleId_idx" ON "ArticleRelation"("targetArticleId");
CREATE INDEX "WorkshopResearch_researchId_idx" ON "WorkshopResearch"("researchId");
CREATE INDEX "WorkshopService_serviceId_idx" ON "WorkshopService"("serviceId");
CREATE INDEX "EventRelation_targetEventId_idx" ON "EventRelation"("targetEventId");

ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "Expert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Event" ADD CONSTRAINT "Event_speakerId_fkey"
  FOREIGN KEY ("speakerId") REFERENCES "Expert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ResearchService" ADD CONSTRAINT "ResearchService_researchId_fkey"
  FOREIGN KEY ("researchId") REFERENCES "ResearchItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResearchService" ADD CONSTRAINT "ResearchService_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpertResearch" ADD CONSTRAINT "ExpertResearch_expertId_fkey"
  FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpertResearch" ADD CONSTRAINT "ExpertResearch_researchId_fkey"
  FOREIGN KEY ("researchId") REFERENCES "ResearchItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleResearch" ADD CONSTRAINT "ArticleResearch_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleResearch" ADD CONSTRAINT "ArticleResearch_researchId_fkey"
  FOREIGN KEY ("researchId") REFERENCES "ResearchItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleService" ADD CONSTRAINT "ArticleService_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleService" ADD CONSTRAINT "ArticleService_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleExpert" ADD CONSTRAINT "ArticleExpert_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleExpert" ADD CONSTRAINT "ArticleExpert_expertId_fkey"
  FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleRelation" ADD CONSTRAINT "ArticleRelation_sourceArticleId_fkey"
  FOREIGN KEY ("sourceArticleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleRelation" ADD CONSTRAINT "ArticleRelation_targetArticleId_fkey"
  FOREIGN KEY ("targetArticleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkshopResearch" ADD CONSTRAINT "WorkshopResearch_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkshopResearch" ADD CONSTRAINT "WorkshopResearch_researchId_fkey"
  FOREIGN KEY ("researchId") REFERENCES "ResearchItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkshopService" ADD CONSTRAINT "WorkshopService_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkshopService" ADD CONSTRAINT "WorkshopService_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventRelation" ADD CONSTRAINT "EventRelation_sourceEventId_fkey"
  FOREIGN KEY ("sourceEventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventRelation" ADD CONSTRAINT "EventRelation_targetEventId_fkey"
  FOREIGN KEY ("targetEventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
