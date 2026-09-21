import "dotenv/config";
import { AnalyticsEventCategory, AnalyticsEventName } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { validateAnalyticsMetadata, validateAnalyticsEventInput } from "../lib/analytics/validation";
import { getAnalyticsAggregate } from "../lib/analytics/queries";

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
    const aggregate = await getAnalyticsAggregate({ range: { start: new Date(Date.now() - 3600000), end: new Date(), label: "verification" }, category: AnalyticsEventCategory.CONTENT, contentType: "SERVICE" });
    if (aggregate.totalViews !== 1 || aggregate.topContent[0]?.views !== 1) throw new Error("Analytics aggregation is incorrect.");
    if (aggregate.topContent[0]?.title !== "Unavailable content") throw new Error("Missing-content handling is incorrect.");
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
