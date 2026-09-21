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

function trendParams(query: AnalyticsQuery, includeContentType: boolean) {
  const params: Array<Date | string> = [query.range.start, query.range.end];
  let suffix = "";
  if (query.category) {
    params.push(query.category);
    suffix += ' AND "eventCategory" = $' + params.length;
  }
  if (includeContentType && query.contentType) {
    params.push(query.contentType);
    suffix += ' AND "contentType" = $' + params.length;
  }
  return { params, suffix };
}

async function dailyCounts(eventNames: string[], query: AnalyticsQuery, includeContentType: boolean) {
  const names = eventNames.map((value) => "'" + value + "'").join(",");
  const binding = trendParams(query, includeContentType);
  const sql = 'SELECT date_trunc(\'day\', "occurredAt") AS day, COUNT(*)::bigint AS count FROM "AnalyticsEvent" WHERE "occurredAt" >= $1 AND "occurredAt" < $2 AND "eventName" IN (' + names + ')' + binding.suffix + ' GROUP BY 1 ORDER BY 1';
  return prisma.client.$queryRawUnsafe<Array<{ day: Date; count: bigint }>>(sql, ...binding.params);
}

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

  const [viewRows, conversionRows] = await Promise.all([
    dailyCounts(VIEW_EVENT_NAMES, query, true),
    dailyCounts(CONVERSION_EVENT_NAMES, query, false),
  ]);

  const topRows = query.category === AnalyticsEventCategory.PAGE ? [] : await prisma.client.analyticsEvent.groupBy({
    by: ["contentType", "contentId"],
    where: { ...viewWhere, contentType: query.contentType ?? { not: null }, contentId: { not: null } },
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
    if (type === AnalyticsContentType.SERVICE) {
      for (const item of await prisma.client.service.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    } else if (type === AnalyticsContentType.RESEARCH) {
      for (const item of await prisma.client.researchItem.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    } else if (type === AnalyticsContentType.EXPERT) {
      for (const item of await prisma.client.expert.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })) titleByKey.set(type + ":" + item.id, item.name);
    } else if (type === AnalyticsContentType.ARTICLE) {
      for (const item of await prisma.client.article.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    } else {
      for (const item of await prisma.client.event.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } })) titleByKey.set(type + ":" + item.id, item.title);
    }
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
