-- Phase 8.18: canonical transactional notification infrastructure
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED');
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL');
CREATE TYPE "NotificationType" AS ENUM ('INQUIRY_RECEIVED', 'REGISTRATION_RECEIVED', 'REGISTRATION_CONFIRMED', 'REGISTRATION_CANCELLED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'PAYMENT_PENDING');

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" UUID,
  "type" "NotificationType" NOT NULL,
  "channel" "NotificationChannel" NOT NULL,
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "subject" TEXT,
  "recipient" TEXT NOT NULL,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "payload" JSONB,
  "provider" TEXT,
  "providerMessageId" TEXT,
  "dedupeKey" TEXT NOT NULL,
  "scheduledFor" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_dedupeKey_key" UNIQUE ("dedupeKey"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
CREATE INDEX "Notification_status_scheduledFor_idx" ON "Notification"("status", "scheduledFor");
CREATE INDEX "Notification_relatedEntityType_relatedEntityId_idx" ON "Notification"("relatedEntityType", "relatedEntityId");
CREATE INDEX "Notification_providerMessageId_idx" ON "Notification"("providerMessageId");
CREATE INDEX "Notification_type_status_idx" ON "Notification"("type", "status");
