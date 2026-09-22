-- Phase 8.17: canonical payment transaction infrastructure
-- Existing production databases may already contain these enums.
-- Enum values for an existing type must be added outside a transaction before
-- this migration runs; see the migration recovery instructions.
DO $bittumama$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'PaymentStatus'
      AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED');
  END IF;
END
$bittumama$;

DO $bittumama$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'PaymentPurpose'
      AND n.nspname = current_schema()
  ) THEN
    CREATE TYPE "PaymentPurpose" AS ENUM ('SERVICE', 'EVENT', 'EVENT_REGISTRATION');
  END IF;
END
$bittumama$;

CREATE TABLE "PaymentTransaction" (
  "id" TEXT NOT NULL,
  "userId" UUID,
  "eventId" TEXT,
  "registrationId" TEXT,
  "serviceId" TEXT,
  "reference" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "amountMinor" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "purpose" "PaymentPurpose" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
  "description" TEXT,
  "metadata" JSONB,
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PaymentTransaction_amount_positive" CHECK ("amountMinor" > 0),
  CONSTRAINT "PaymentTransaction_currency_format" CHECK (char_length("currency") = 3 AND "currency" = upper("currency")),
  CONSTRAINT "PaymentTransaction_target_exactly_one" CHECK (
    (CASE WHEN "serviceId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "eventId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "registrationId" IS NOT NULL THEN 1 ELSE 0 END) = 1
  ),
  CONSTRAINT "PaymentTransaction_purpose_matches_target" CHECK (
    ("purpose" = 'SERVICE' AND "serviceId" IS NOT NULL AND "eventId" IS NULL AND "registrationId" IS NULL) OR
    ("purpose" = 'EVENT' AND "eventId" IS NOT NULL AND "serviceId" IS NULL AND "registrationId" IS NULL) OR
    ("purpose" = 'EVENT_REGISTRATION' AND "registrationId" IS NOT NULL AND "serviceId" IS NULL AND "eventId" IS NULL)
  )
);

CREATE UNIQUE INDEX "PaymentTransaction_reference_key" ON "PaymentTransaction"("reference");
CREATE UNIQUE INDEX "PaymentTransaction_idempotencyKey_key" ON "PaymentTransaction"("idempotencyKey");
CREATE UNIQUE INDEX "PaymentTransaction_provider_providerTransactionId_key" ON "PaymentTransaction"("provider", "providerTransactionId");
CREATE INDEX "PaymentTransaction_userId_createdAt_idx" ON "PaymentTransaction"("userId", "createdAt");
CREATE INDEX "PaymentTransaction_status_createdAt_idx" ON "PaymentTransaction"("status", "createdAt");
CREATE INDEX "PaymentTransaction_provider_createdAt_idx" ON "PaymentTransaction"("provider", "createdAt");
CREATE INDEX "PaymentTransaction_eventId_idx" ON "PaymentTransaction"("eventId");
CREATE INDEX "PaymentTransaction_registrationId_idx" ON "PaymentTransaction"("registrationId");
CREATE INDEX "PaymentTransaction_serviceId_idx" ON "PaymentTransaction"("serviceId");
CREATE INDEX "PaymentTransaction_purpose_createdAt_idx" ON "PaymentTransaction"("purpose", "createdAt");

ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;