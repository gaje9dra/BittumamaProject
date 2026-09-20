-- Phase 8.8: Contact / Inquiry backend
CREATE TYPE "ContactInquiryStatus" AS ENUM ('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'SPAM');

CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "serviceId" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactInquiryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactInquiry_status_idx" ON "ContactInquiry"("status");
CREATE INDEX "ContactInquiry_submittedAt_idx" ON "ContactInquiry"("submittedAt");
CREATE INDEX "ContactInquiry_serviceId_idx" ON "ContactInquiry"("serviceId");

ALTER TABLE "ContactInquiry"
ADD CONSTRAINT "ContactInquiry_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
