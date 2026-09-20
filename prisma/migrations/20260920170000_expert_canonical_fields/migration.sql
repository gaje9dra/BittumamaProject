CREATE TABLE "ExpertService" (
  "expertId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,

  CONSTRAINT "ExpertService_pkey" PRIMARY KEY ("expertId", "serviceId")
);

ALTER TABLE "Expert"
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Expert_order_idx" ON "Expert"("order");
CREATE INDEX "ExpertService_serviceId_idx" ON "ExpertService"("serviceId");

ALTER TABLE "ExpertService"
  ADD CONSTRAINT "ExpertService_expertId_fkey"
  FOREIGN KEY ("expertId") REFERENCES "Expert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpertService"
  ADD CONSTRAINT "ExpertService_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
