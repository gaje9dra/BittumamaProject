import "server-only";

import { AnalyticsContentType, AnalyticsEventCategory } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { getAnalyticsAggregate, resolveAnalyticsDateRange } from "@/lib/analytics/queries";

export async function getAdminAnalytics(input: { range?: string; start?: string; end?: string; category?: string; contentType?: string }) {
  await requireAdmin();
  const category = Object.values(AnalyticsEventCategory).includes(input.category as AnalyticsEventCategory) ? input.category as AnalyticsEventCategory : undefined;
  const contentType = Object.values(AnalyticsContentType).includes(input.contentType as AnalyticsContentType) ? input.contentType as AnalyticsContentType : undefined;
  const range = resolveAnalyticsDateRange(input.range, input.start, input.end);
  return { data: await getAnalyticsAggregate({ range, category, contentType }), range, category, contentType };
}
