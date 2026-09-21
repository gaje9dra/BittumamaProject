import type { AnalyticsContentType, AnalyticsEventCategory, AnalyticsEventName } from "@/generated/prisma/client";

export type AnalyticsMetadata = Record<string, string | number | null> | null;

export type AnalyticsEventInput = {
  eventName: AnalyticsEventName;
  eventCategory: AnalyticsEventCategory;
  userId?: string | null;
  anonymousId?: string | null;
  sessionId?: string | null;
  path?: string | null;
  contentType?: AnalyticsContentType | null;
  contentId?: string | null;
  metadata?: AnalyticsMetadata;
  occurredAt?: Date;
};

export type AnalyticsDateRange = { start: Date; end: Date; label: string };

export type AnalyticsQuery = {
  range: AnalyticsDateRange;
  category?: AnalyticsEventCategory;
  contentType?: AnalyticsContentType;
};

export type AnalyticsAggregate = {
  totalViews: number;
  inquiries: number;
  registrations: number;
  paymentAttempts: number;
  paymentSuccess: number;
  paymentFailed: number;
  viewsTrend: Array<{ day: string; count: number }>;
  conversionsTrend: Array<{ day: string; count: number }>;
  topContent: Array<{ contentType: AnalyticsContentType; contentId: string; title: string; views: number }>;
};
