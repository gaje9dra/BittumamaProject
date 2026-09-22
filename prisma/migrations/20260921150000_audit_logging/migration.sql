-- Phase 8.21: canonical append-only audit logging.
CREATE TYPE "AuditCategory" AS ENUM ('AUTHENTICATION','AUTHORIZATION','CONTENT','MEDIA','INQUIRY','REGISTRATION','PAYMENT','NOTIFICATION','SYSTEM');
CREATE TYPE "AuditResult" AS ENUM ('SUCCESS','FAILURE');
CREATE TYPE "AuditSeverity" AS ENUM ('INFO','WARNING','CRITICAL');
CREATE TYPE "AuditAction" AS ENUM (
  'AUTH_LOGIN','AUTH_LOGOUT','AUTH_LOGIN_FAILED','USER_ROLE_CHANGED','USER_SECURITY_CHANGED',
  'CONTENT_CREATED','CONTENT_UPDATED','CONTENT_PUBLISHED','CONTENT_UNPUBLISHED','CONTENT_ARCHIVED',
  'MEDIA_CREATED','MEDIA_UPDATED','MEDIA_DELETED','INQUIRY_STATUS_CHANGED',
  'REGISTRATION_STATUS_CHANGED','REGISTRATION_CANCELLED','PAYMENT_RECONCILED','PAYMENT_STATE_CHANGED',
  'NOTIFICATION_RETRIED','SEARCH_ADMIN_ACTION','SYSTEM_CONFIGURATION_CHANGED'
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "actorUserId" UUID,
  "action" "AuditAction" NOT NULL,
  "category" "AuditCategory" NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "result" "AuditResult" NOT NULL,
  "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
  "summary" TEXT NOT NULL,
  "metadata" JSONB,
  "requestId" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId","createdAt");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action","createdAt");
CREATE INDEX "AuditLog_category_createdAt_idx" ON "AuditLog"("category","createdAt");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType","entityId");
CREATE INDEX "AuditLog_result_createdAt_idx" ON "AuditLog"("result","createdAt");
CREATE INDEX "AuditLog_severity_createdAt_idx" ON "AuditLog"("severity","createdAt");
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
