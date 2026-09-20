ALTER TABLE "Service"
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "highlights" JSONB,
  ADD COLUMN "faq" JSONB;

CREATE INDEX "Service_order_idx" ON "Service"("order");
