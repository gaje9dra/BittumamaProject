import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { AnalyticsEventInput } from "@/lib/analytics/types";

export async function createAnalyticsEvent(input: AnalyticsEventInput) {
  return prisma.client.analyticsEvent.create({
    data: {
      eventName: input.eventName, eventCategory: input.eventCategory, userId: input.userId ?? null,
      anonymousId: input.anonymousId ?? null, sessionId: input.sessionId ?? null, path: input.path ?? null,
      contentType: input.contentType ?? null, contentId: input.contentId ?? null, metadata: input.metadata ?? undefined,
      occurredAt: input.occurredAt ?? new Date(),
    },
    select: { id: true, eventName: true, occurredAt: true },
  });
}
