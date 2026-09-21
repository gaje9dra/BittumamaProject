ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

CREATE TABLE "AdminAccount" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "lastLoginAt" TIMESTAMP(3),
  CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminSession" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "adminAccountId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminAccount_normalizedEmail_key" ON "AdminAccount"("normalizedEmail");
CREATE INDEX "AdminAccount_isActive_idx" ON "AdminAccount"("isActive");
CREATE UNIQUE INDEX "AdminSession_sessionToken_key" ON "AdminSession"("sessionToken");
CREATE INDEX "AdminSession_adminAccountId_idx" ON "AdminSession"("adminAccountId");
CREATE INDEX "AdminSession_expires_idx" ON "AdminSession"("expires");

ALTER TABLE "AdminSession"
ADD CONSTRAINT "AdminSession_adminAccountId_fkey"
FOREIGN KEY ("adminAccountId") REFERENCES "AdminAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
