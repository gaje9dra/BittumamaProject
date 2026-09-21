import { AnalyticsEventName } from "@/generated/prisma/client";

const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidAnalyticsId(value: string) { return ID_PATTERN.test(value); }
export function isValidAnalyticsAnonymousId(value: string) { return UUID_PATTERN.test(value); }

export function normalizeAnalyticsPath(value: string | null | undefined) {
  if (!value) return null;
  const path = value.trim().split(/[?#]/, 1)[0];
  if (!path.startsWith("/") || path.length > 2048) return null;
  if (path.startsWith("/admin") || path.startsWith("/api/") || path.startsWith("/_next/")) return null;
  if (path.startsWith("/admin/preview/") || path.startsWith("/api/internal/")) return null;
  return path || "/";
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function exactKeys(value: Record<string, unknown>, allowed: string[]) { return Object.keys(value).every((key) => allowed.includes(key)); }
function optionalString(value: unknown, max = 256) { return value === undefined || value === null || (typeof value === "string" && value.length <= max); }

export function validateAnalyticsMetadata(eventName: AnalyticsEventName, metadata: unknown): Record<string, string | number | null> | null {
  if (metadata === undefined || metadata === null) return null;
  const value = record(metadata);
  if (!value) throw new Error("INVALID_ANALYTICS_METADATA");

  const allowedByEvent: Record<AnalyticsEventName, string[]> = {
    PAGE_VIEW: [], CONTENT_VIEW: ["path"], SERVICE_VIEW: ["path"], RESEARCH_VIEW: ["path"], EXPERT_VIEW: ["path"], ARTICLE_VIEW: ["path"], WORKSHOP_VIEW: ["path"],
    CONTACT_SUBMISSION: ["sourcePath", "serviceId"], REGISTRATION_STARTED: ["eventId"], REGISTRATION_COMPLETED: ["eventId", "registrationId"],
    PAYMENT_INITIATED: ["paymentTransactionId", "purpose", "currency"], PAYMENT_SUCCESS: ["paymentTransactionId", "purpose", "currency"], PAYMENT_FAILED: ["paymentTransactionId", "purpose", "currency"],\n    SEARCH_SUBMITTED: ["queryLengthBucket"],
  };

  if (!exactKeys(value, allowedByEvent[eventName])) throw new Error("INVALID_ANALYTICS_METADATA");
  for (const [key, item] of Object.entries(value)) {
    if (!optionalString(item) && typeof item !== "number") throw new Error("INVALID_ANALYTICS_METADATA");
    if (key === "sourcePath" && item !== null && typeof item === "string" && !normalizeAnalyticsPath(item)) throw new Error("INVALID_ANALYTICS_METADATA");
    if (key === "serviceId" && item !== null && typeof item === "string" && !isValidAnalyticsId(item)) throw new Error("INVALID_ANALYTICS_METADATA");
    if ((key === "eventId" || key === "registrationId" || key === "paymentTransactionId") && item !== null && typeof item === "string" && !isValidAnalyticsId(item)) throw new Error("INVALID_ANALYTICS_METADATA");
    if (key === "currency" && item !== null && (typeof item !== "string" || !/^[A-Z]{3}$/.test(item))) throw new Error("INVALID_ANALYTICS_METADATA");
    if (key === "purpose" && item !== null && (typeof item !== "string" || item.length > 64)) throw new Error("INVALID_ANALYTICS_METADATA");\n    if (key === "queryLengthBucket" && item !== "short" && item !== "medium" && item !== "long") throw new Error("INVALID_ANALYTICS_METADATA");
  }
  return value as Record<string, string | number | null>;
}

export function validateAnalyticsEventInput(input: {
  eventName: AnalyticsEventName;
  path?: string | null;
  contentId?: string | null;
  metadata?: unknown;
  anonymousId?: string | null;
  sessionId?: string | null;
}) {
  const path = normalizeAnalyticsPath(input.path);
  if (input.path && !path) throw new Error("INVALID_ANALYTICS_PATH");
  if (input.contentId && !isValidAnalyticsId(input.contentId)) throw new Error("INVALID_ANALYTICS_CONTENT_ID");
  if (input.anonymousId && !isValidAnalyticsAnonymousId(input.anonymousId)) throw new Error("INVALID_ANALYTICS_ANONYMOUS_ID");
  if (input.sessionId && !isValidAnalyticsAnonymousId(input.sessionId)) throw new Error("INVALID_ANALYTICS_SESSION_ID");
  const metadata = validateAnalyticsMetadata(input.eventName, input.metadata);
  return { path, metadata };
}
