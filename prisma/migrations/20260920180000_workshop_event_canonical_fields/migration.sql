ALTER TABLE "Event"
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "speakerSlug" TEXT;

CREATE INDEX "Event_order_idx" ON "Event"("order");
