CREATE TYPE "ResearchAvailability" AS ENUM ('AVAILABLE', 'COMING_SOON');

ALTER TABLE "ResearchItem"
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "availability" "ResearchAvailability" NOT NULL DEFAULT 'AVAILABLE',
  ADD COLUMN "highlights" JSONB;

CREATE INDEX "ResearchItem_order_idx" ON "ResearchItem"("order");
