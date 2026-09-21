import "dotenv/config";
import { AnalyticsEventCategory, AnalyticsEventName } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { validateAnalyticsMetadata, validateAnalyticsEventInput } from "../lib/analytics/validation";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify analytics.");
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const suffix = Date.now().toString(36);
  const user = await prisma.user.create({ data: { email: "analytics-test-" + suffix + "@example.test" } });
  try {
    const anonymousId = randomUUID();
    const sessionId = randomUUID();
    const validated = validateAnalyticsEventInput({ eventName: AnalyticsEventName.PAGE_VIEW, path: "/services/test-service", anonymousId, sessionId });
    if (validated.path !== "/services/test-service") throw new Error("Valid page event rejected.");
    let invalidRejected = false;
    try { validateAnalyticsMetadata(AnalyticsEventName.PAGE_VIEW, { secret: "nope" }); } catch { invalidRejected = true; }
    if (!invalidRejected) throw new Error("Sensitive/unknown metadata was accepted.");
    await prisma.analyticsEvent.create({ data: { eventName: AnalyticsEventName.SERVICE_VIEW, eventCategory: AnalyticsEventCategory.CONTENT, userId: user.id, anonymousId, sessionId, path: "/services/test-service", contentType: "SERVICE", contentId: "test-service", metadata: { path: "/services/test-service" } } });
    const start = new Date(Date.now() - 3600000);
    const end = new Date();
    const totalViews = await prisma.analyticsEvent.count({
      where: {
        occurredAt: { gte: start, lt: end },
        eventCategory: AnalyticsEventCategory.CONTENT,
        eventName: { in: [AnalyticsEventName.SERVICE_VIEW] },
        contentType: "SERVICE",
      },
    });
    const topRows = await prisma.analyticsEvent.groupBy({
      by: ["contentType", "contentId"],
      where: {
        occurredAt: { gte: start, lt: end },
        eventCategory: AnalyticsEventCategory.CONTENT,
        eventName: { in: [AnalyticsEventName.SERVICE_VIEW] },
        contentType: "SERVICE",
        contentId: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    if (totalViews !== 1 || topRows[0]?._count.id !== 1) throw new Error("Analytics aggregation is incorrect.");
    const title = topRows[0]?.contentId
      ? await prisma.service.findUnique({ where: { id: topRows[0].contentId }, select: { title: true } })
      : null;
    if (title !== null) throw new Error("Missing-content handling is incorrect.");
    const stored = await prisma.analyticsEvent.findFirst({ where: { userId: user.id }, select: { userId: true, anonymousId: true, sessionId: true, metadata: true } });
    if (!stored || stored.userId !== user.id || !stored.anonymousId || !stored.sessionId) throw new Error("Identity fields were not persisted as expected.");
    console.log("Analytics infrastructure verification passed.");
  } finally {
    await prisma.analyticsEvent.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }
}
main().catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exitCode = 1; });
