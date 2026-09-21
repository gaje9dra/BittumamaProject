import { AnalyticsContentType, AnalyticsEventCategory, AnalyticsEventName } from "@/generated/prisma/client";

export type AnalyticsEventDefinition = {
  category: AnalyticsEventCategory;
  clientAllowed: boolean;
  contentType?: AnalyticsContentType;
};

export const ANALYTICS_EVENT_REGISTRY: Record<AnalyticsEventName, AnalyticsEventDefinition> = {
  PAGE_VIEW: { category: AnalyticsEventCategory.PAGE, clientAllowed: true },
  CONTENT_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false },
  SERVICE_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false, contentType: AnalyticsContentType.SERVICE },
  RESEARCH_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false, contentType: AnalyticsContentType.RESEARCH },
  EXPERT_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false, contentType: AnalyticsContentType.EXPERT },
  ARTICLE_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false, contentType: AnalyticsContentType.ARTICLE },
  WORKSHOP_VIEW: { category: AnalyticsEventCategory.CONTENT, clientAllowed: false, contentType: AnalyticsContentType.WORKSHOP },
  CONTACT_SUBMISSION: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: false },
  REGISTRATION_STARTED: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: true, contentType: AnalyticsContentType.WORKSHOP },
  REGISTRATION_COMPLETED: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: false, contentType: AnalyticsContentType.WORKSHOP },
  PAYMENT_INITIATED: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: false },
  PAYMENT_SUCCESS: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: false },
  PAYMENT_FAILED: { category: AnalyticsEventCategory.CONVERSION, clientAllowed: false },
};

export const VIEW_EVENT_NAMES: AnalyticsEventName[] = [
  AnalyticsEventName.PAGE_VIEW,
  AnalyticsEventName.SERVICE_VIEW,
  AnalyticsEventName.RESEARCH_VIEW,
  AnalyticsEventName.EXPERT_VIEW,
  AnalyticsEventName.ARTICLE_VIEW,
  AnalyticsEventName.WORKSHOP_VIEW,
];

export const CONVERSION_EVENT_NAMES: AnalyticsEventName[] = [
  AnalyticsEventName.CONTACT_SUBMISSION,
  AnalyticsEventName.REGISTRATION_STARTED,
  AnalyticsEventName.REGISTRATION_COMPLETED,
  AnalyticsEventName.PAYMENT_INITIATED,
  AnalyticsEventName.PAYMENT_SUCCESS,
  AnalyticsEventName.PAYMENT_FAILED,
];
