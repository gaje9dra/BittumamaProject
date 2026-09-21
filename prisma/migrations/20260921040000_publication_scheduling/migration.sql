-- Phase 8.15: publication scheduling foundation
ALTER TABLE "Service" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "ResearchItem" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "Expert" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "Article" ADD COLUMN "publishAt" TIMESTAMP(3);
ALTER TABLE "Event" ADD COLUMN "publishAt" TIMESTAMP(3);

CREATE INDEX "Service_publishAt_idx" ON "Service"("publishAt");
CREATE INDEX "ResearchItem_publishAt_idx" ON "ResearchItem"("publishAt");
CREATE INDEX "Expert_publishAt_idx" ON "Expert"("publishAt");
CREATE INDEX "Article_publishAt_idx" ON "Article"("publishAt");
CREATE INDEX "Event_publishAt_idx" ON "Event"("publishAt");
