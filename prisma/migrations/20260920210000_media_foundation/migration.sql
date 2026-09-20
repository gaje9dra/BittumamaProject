CREATE TYPE "MediaStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "publicUrl" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "normalizedFilename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "altText" TEXT,
  "caption" TEXT,
  "status" "MediaStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");
CREATE INDEX "MediaAsset_status_idx" ON "MediaAsset"("status");
CREATE INDEX "MediaAsset_mimeType_idx" ON "MediaAsset"("mimeType");
CREATE INDEX "MediaAsset_originalFilename_idx" ON "MediaAsset"("originalFilename");

ALTER TABLE "ResearchItem" ADD COLUMN "imageMediaId" TEXT;
ALTER TABLE "Expert" ADD COLUMN "profileMediaId" TEXT;
ALTER TABLE "Article" ADD COLUMN "coverMediaId" TEXT;
ALTER TABLE "Event" ADD COLUMN "coverMediaId" TEXT;

CREATE INDEX "ResearchItem_imageMediaId_idx" ON "ResearchItem"("imageMediaId");
CREATE INDEX "Expert_profileMediaId_idx" ON "Expert"("profileMediaId");
CREATE INDEX "Article_coverMediaId_idx" ON "Article"("coverMediaId");
CREATE INDEX "Event_coverMediaId_idx" ON "Event"("coverMediaId");

ALTER TABLE "ResearchItem" ADD CONSTRAINT "ResearchItem_imageMediaId_fkey" FOREIGN KEY ("imageMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Expert" ADD CONSTRAINT "Expert_profileMediaId_fkey" FOREIGN KEY ("profileMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
