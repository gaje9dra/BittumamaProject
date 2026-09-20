ALTER TABLE "Article"
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "author" TEXT,
  ADD COLUMN "authorRole" TEXT,
  ADD COLUMN "authorSlug" TEXT;

CREATE INDEX "Article_order_idx" ON "Article"("order");
