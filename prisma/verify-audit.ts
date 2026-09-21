import "dotenv/config";

import { AuditAction, AuditCategory, AuditResult, AuditSeverity } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { recordAudit, sanitizeAuditMetadata } from "@/lib/audit/service";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to verify audit logging.");
  const sanitized = sanitizeAuditMetadata({ safe: "ok", password: "must-not-persist", authorization: "must-not-persist", count: 2 });
  if (!sanitized || "password" in sanitized || "authorization" in sanitized || sanitized.safe !== "ok") throw new Error("Audit metadata redaction failed.");

  const marker = "phase821" + Date.now().toString(36);
  let rolledBack = false;
  try {
    await prisma.client.$transaction(async (tx) => {
      const row = await recordAudit(tx, {
        action: AuditAction.CONTENT_UPDATED,
        category: AuditCategory.CONTENT,
        result: AuditResult.SUCCESS,
        severity: AuditSeverity.INFO,
        summary: "Audit verification transaction.",
        entityType: "Verification",
        entityId: marker,
        metadata: { marker, safe: true, token: "must-not-persist" },
        actor: { userId: null, type: "SYSTEM" },
      });
      if (row.entityId !== marker || row.result !== AuditResult.SUCCESS) throw new Error("Audit persistence failed.");
      const stored = await tx.auditLog.findUnique({ where: { id: row.id }, select: { metadata: true, actorUserId: true, createdAt: true } });
      if (!stored || stored.actorUserId !== null || stored.createdAt > new Date()) throw new Error("Audit server-derived fields failed.");
      if (JSON.stringify(stored.metadata).includes("must-not-persist")) throw new Error("Secret metadata reached storage.");
      throw new Error("ROLLBACK_AUDIT_VERIFICATION");
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ROLLBACK_AUDIT_VERIFICATION") rolledBack = true;
    else throw error;
  }
  if (!rolledBack) throw new Error("Audit verification transaction did not roll back as expected.");
  console.log("Audit infrastructure verification passed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
