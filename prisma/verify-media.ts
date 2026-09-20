import "dotenv/config";
import { prisma } from "@/lib/db/prisma";
import { getMediaStorage } from "@/lib/media/storage";
import { getMediaOrphanReport } from "@/lib/media/repository";

async function main() {
  const report = await getMediaOrphanReport();
  let failures = 0;
  for (const item of report) {
    if (!(await getMediaStorage().exists(item.storageKey))) {
      console.error("Missing storage object:", item.id, item.storageKey);
      failures += 1;
    }
    if (!/^\/api\/media\/[a-zA-Z0-9_-]+$/.test(item.publicUrl)) {
      console.error("Invalid public URL:", item.id, item.publicUrl);
      failures += 1;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(item.mimeType)) {
      console.error("Unsupported MIME in database:", item.id, item.mimeType);
      failures += 1;
    }
  }
  const missingRefs = await Promise.all([
    prisma.client.article.findMany({ where: { coverMediaId: { not: null }, coverMedia: null }, select: { id: true } }),
    prisma.client.expert.findMany({ where: { profileMediaId: { not: null }, profileMedia: null }, select: { id: true } }),
    prisma.client.researchItem.findMany({ where: { imageMediaId: { not: null }, imageMedia: null }, select: { id: true } }),
    prisma.client.event.findMany({ where: { coverMediaId: { not: null }, coverMedia: null }, select: { id: true } }),
  ]);
  failures += missingRefs.reduce((sum, rows) => sum + rows.length, 0);
  if (failures) throw new Error("Media verification failed with " + failures + " issue(s).");
  console.log("Media verification passed: " + report.length + " MediaAsset record(s) checked.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
