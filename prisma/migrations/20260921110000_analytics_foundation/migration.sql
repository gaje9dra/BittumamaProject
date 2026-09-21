-- Phase 8.19: canonical first-party analytics infrastructure
CREATE TYPE "AnalyticsEventCategory" AS ENUM ('PAGE', 'CONTENT', 'CONVERSION');
CREATE TYPE "AnalyticsEventName" AS ENUM ('PAGE_VIEW', 'CONTENT_VIEW', 'SERVICE_VIEW', 'RESEARCH_VIEW', 'EXPERT_VIEW', 'ARTICLE_VIEW', 'WORKSHOP_VIEW', 'CONTACT_SUBMISSION', 'REGISTRATION_STARTED', 'REGISTRATION_COMPLETED', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED');
CREATE TYPE "AnalyticsContentType" AS ENUM ('SERVICE', 'RESEARCH', 'EXPERT', 'ARTICLE', 'WORKSHOP');

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "eventName" "AnalyticsEventName" NOT NULL,
  "eventCategory" "AnalyticsEventCategory" NOT NULL,
  "userId" TEXT,
  "anonymousId" TEXT,
  "sessionId" TEXT,
  "path" TEXT,
  "contentType" "AnalyticsContentType",
  "contentId" TEXT,
  "metadata" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "AnalyticsEvent_occurredAt_idx" ON "AnalyticsEvent"("occurredAt");
CREATE INDEX "AnalyticsEvent_eventName_occurredAt_idx" ON "AnalyticsEvent"("eventName", "occurredAt");
CREATE INDEX "AnalyticsEvent_eventCategory_occurredAt_idx" ON "AnalyticsEvent"("eventCategory", "occurredAt");
CREATE INDEX "AnalyticsEvent_contentType_contentId_occurredAt_idx" ON "AnalyticsEvent"("contentType", "contentId", "occurredAt");
CREATE INDEX "AnalyticsEvent_userId_occurredAt_idx" ON "AnalyticsEvent"("userId", "occurredAt");
CREATE INDEX "AnalyticsEvent_anonymousId_occurredAt_idx" ON "AnalyticsEvent"("anonymousId", "occurredAt");
