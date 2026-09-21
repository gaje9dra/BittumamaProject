-- Phase 8.16: event/workshop registration infrastructure
CREATE TYPE "EventRegistrationMode" AS ENUM ('ANONYMOUS_ALLOWED', 'AUTHENTICATED_ONLY');
CREATE TYPE "EventRegistrationRecordStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED');

ALTER TABLE "Event"
  ADD COLUMN "registrationEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "registrationCapacity" INTEGER,
  ADD COLUMN "registrationDeadline" TIMESTAMP(3),
  ADD COLUMN "registrationMode" "EventRegistrationMode" NOT NULL DEFAULT 'ANONYMOUS_ALLOWED';

CREATE TABLE "EventRegistration" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "userId" TEXT,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "organization" TEXT,
  "notes" TEXT,
  "status" "EventRegistrationRecordStatus" NOT NULL DEFAULT 'CONFIRMED',
  "activeIdentityKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventRegistration_eventId_activeIdentityKey_key" ON "EventRegistration"("eventId", "activeIdentityKey");
CREATE INDEX "EventRegistration_eventId_status_idx" ON "EventRegistration"("eventId", "status");
CREATE INDEX "EventRegistration_userId_createdAt_idx" ON "EventRegistration"("userId", "createdAt");
CREATE INDEX "EventRegistration_eventId_createdAt_idx" ON "EventRegistration"("eventId", "createdAt");
CREATE INDEX "EventRegistration_email_idx" ON "EventRegistration"("email");

ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Event_registrationDeadline_idx" ON "Event"("registrationDeadline");
