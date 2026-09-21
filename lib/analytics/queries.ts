import "server-only";

import { AnalyticsContentType, AnalyticsEventCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { CONVERSION_EVENT_NAMES, VIEW_EVENT_NAMES } from "@/lib/analytics/registry";
import type { AnalyticsAggregate, AnalyticsQuery, AnalyticsDateRange } from "@/lib/analytics/types";

function validDate(value: Date) { return !Number.isNaN(value.getTime()); }

export function resolveAnalyticsDateRange(range: string | undefined, startValue?: string, endValue?: string): AnalyticsDateRange {
  const now = new Date();
  if (range === "today") {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return { start, end: now, label: "Today (UTC)" };
  }
  if (range === "7d") return { start: new Date(now.getTime() - 7 * 86400000), end: now, label: "Last 7 days" };
  if (range === "30d" || !range) return { start: new Date(now.getTime() - 30 * 86400000), end: now, label: "Last 30 days" };
  if (range === "custom" && startValue && endValue) {
    const start = new Date(startValue + "T00:00:00.000Z");
    const end = new Date(endValue + "T00:00:00.000Z");
    if (validDate(start) && validDate(end) && end > start && end.getTime() - start.getTime() <= 366 * 86400000) {
      return { start, end: new Date(end.getTime() + 86400000), label: startValue + " → " + endValue + " (UTC)" };
    }
  }
  return resolveAnalyticsDateRange("30d");
}

function dateWhere(range: AnalyticsDateRange) { return { occurredAt: { gte: range.start, lt: range.end } }; }

export async function getAnalyticsAggregate(query: AnalyticsQuery): Promise<AnalyticsAggregate> {
  const base = { ...dateWhere(query.range), ...(query.category ? { eventCategory: query.category } : {}) };
  const viewWhere = { ...base, eventName: { in: VIEW_EVENT_NAMES }, ...(query.contentType ? { contentType: query.contentType } : {}) };
  const conversionWhere = { ...base, eventName: { in: CONVERSION_EVENT_NAMES } };

  const [totalViews, inquiries, registrations, paymentAttempts, paymentSuccess, paymentFailed] = await Promise.all([
    prisma.client.analyticsEvent.count({ where: viewWhere }),
    prisma.client.analyticsEvent.count({ where: { ...conversionWhere, eventName: "CONTACT_SUBMISSION" } }),
    prisma.client.analyticsEvent.count({ where: { ...conversionWhere, eventName: "REGISTRATION_COMPLETED" } }),
    prisma.client.analyticsEvent.count({ where: { ...conversionWhere, eventName: "PAYMENT_INITIATED" } }),
    prisma.client.analyticsEvent.count({ where: { ...conversionWhere, eventName: "PAYMENT_SUCCESS" } }),
    prisma.client.analyticsEvent.count({ where: { ...conversionWhere, eventName: "PAYMENT_FAILED" } }),
  ]);

  const viewNames = VIEW_EVENT_NAMES.map((value) => "'" + value + "'").join(",");
  const conversionNames = CONVERSION_EVENT_NAMES.map((value) => "'" + value + "'").join(",");
  const categorySql = query.category ? ' AND "eventCategory" = $3' : "";
  const contentSql = query.contentType ? ' AND "contentType" = $4' : "";
  const viewRows = await prisma.client.$queryRawUnsafe<Array<{ day: Date; count: bigint }>>(
    'SELECT date_trunc(\'day\', "occurredAt") AS day, COUNT(*)::bigint AS count FROM "AnalyticsEvent" WHERE "occurredAt" >= $1 AND "occurredAt" < $2 AND "eventName" IN (' + viewNames + ')' + categorySql + contentSql + ' GROUP BY 1 ORDER BY 1',
    query.range.start, query.range.end, query.category ?? null, query.contentType ?? null,
  );
  const conversionRows = await prisma.client.$queryRawUnsafe<Array<{ day: Date; count: bigint }>>(
    'SELECT date_trunc(\'day\', "occurredAt") AS day, COUNT(*)::bigint AS count FROM "AnalyticsEvent" WHERE "occurredAt" >= $1 AND "occurredAt" < $2 AND "eventName" IN (' + conversionNames + ')' + categorySql + ' GROUP BY 1 ORDER BY 1',
    query.range.start, query.range.end, query.category ?? null,
  );

  const topRows = query.category === AnalyticsEventCategory.PAGE ? [] : await prisma.client.analyticsEvent.groupBy({
    by: ["contentType", "contentId"],
    where: { ...viewWhere, contentType: { not: null }, contentId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { _all: "desc" } },
    take: 10,
  });

  const titleByKey = new Map<string, string>();
  const idsByType = new Map<AnalyticsContentType, string[]>();
  for (const row of topRows) {
    if (row.contentType && row.contentId) idsByType.set(row.contentType, [...(idsByType.get(row.contentType) ?? []), row.contentId]);
  }
  for (const [type, ids] of idsByType) {
    if (type === AnalyticsContentType.SERVICE) for (const item of await prisma.client.service.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    else if (type === AnalyticsContentType.RESEARCH) for (const item of await prisma.client.researchItem.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    else if (type === AnalyticsContentType.EXPERT) for (const item of await prisma.client.expert.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })) titleByKey.set(type + ":" + item.id, item.name);
    else if (type === AnalyticsContentType.ARTICLE) for (const item of await prisma.client.article.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    else for (const item of await prisma.client.event.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
  }

  return {
    totalViews, inquiries, registrations, paymentAttempts, paymentSuccess, paymentFailed,
    viewsTrend: viewRows.map((row) => ({ day: row.day.toISOString().slice(0, 10), count: Number(row.count) })),
    conversionsTrend: conversionRows.map((row) => ({ day: row.day.toISOString().slice(0, 10), count: Number(row.count) })),
    topContent: topRows.filter((row) => row.contentType && row.contentId).map((row) => ({
      contentType: row.contentType!, contentId: row.contentId!, title: titleByKey.get(row.contentType! + ":" + row.contentId!) ?? "Unavailable content", views: row._count._all,
    })),
  };
}
