import "server-only";

import { AnalyticsEventName } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ANALYTICS_EVENT_REGISTRY } from "@/lib/analytics/registry";
import { createAnalyticsEvent } from "@/lib/analytics/repository";
import { validateAnalyticsEventInput } from "@/lib/analytics/validation";
import type { AnalyticsEventInput } from "@/lib/analytics/types";

function logAnalyticsFailure(error: unknown, eventName: AnalyticsEventName) {
  console.error("Analytics event failed:", { eventName, error: error instanceof Error ? error.message : "unknown" });
}

export async function trackAnalyticsEvent(input: AnalyticsEventInput) {
  try {
    return await recordAnalyticsEvent(input);
  } catch (error) {
    logAnalyticsFailure(error, input.eventName);
    return null;
  }
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  const definition = ANALYTICS_EVENT_REGISTRY[input.eventName];
  if (!definition || definition.category !== input.eventCategory) throw new Error("INVALID_ANALYTICS_EVENT");
  if (definition.contentType && input.contentType !== definition.contentType) throw new Error("INVALID_ANALYTICS_CONTENT_TYPE");
  const validated = validateAnalyticsEventInput(input);
  return createAnalyticsEvent({ ...input, path: validated.path, metadata: validated.metadata });
}

export async function resolvePublicContent(path: string) {
  const match = /^\/(services|research|experts|articles|workshops)\/([^/]+)\/?$/.exec(path);
  if (!match) return null;
  const slug = decodeURIComponent(match[2]);
  const now = new Date();
  const publicWhere = { slug, status: "PUBLISHED" as const, OR: [{ publishAt: null }, { publishAt: { lte: now } }] };

  if (match[1] === "services") {
    const item = await prisma.client.service.findFirst({ where: publicWhere, select: { id: true } });
    return item ? { eventName: AnalyticsEventName.SERVICE_VIEW, contentType: "SERVICE" as const, contentId: item.id } : null;
  }
  if (match[1] === "research") {
    const item = await prisma.client.researchItem.findFirst({ where: publicWhere, select: { id: true } });
    return item ? { eventName: AnalyticsEventName.RESEARCH_VIEW, contentType: "RESEARCH" as const, contentId: item.id } : null;
  }
  if (match[1] === "experts") {
    const item = await prisma.client.expert.findFirst({ where: publicWhere, select: { id: true } });
    return item ? { eventName: AnalyticsEventName.EXPERT_VIEW, contentType: "EXPERT" as const, contentId: item.id } : null;
  }
  if (match[1] === "articles") {
    const item = await prisma.client.article.findFirst({ where: publicWhere, select: { id: true } });
    return item ? { eventName: AnalyticsEventName.ARTICLE_VIEW, contentType: "ARTICLE" as const, contentId: item.id } : null;
  }
  const item = await prisma.client.event.findFirst({ where: publicWhere, select: { id: true } });
  return item ? { eventName: AnalyticsEventName.WORKSHOP_VIEW, contentType: "WORKSHOP" as const, contentId: item.id } : null;
}
