export type AnalyticsClientEvent =
  | { eventName: "PAGE_VIEW"; path: string; anonymousId?: string; sessionId?: string }
  | { eventName: "REGISTRATION_STARTED"; path: string; eventId: string; anonymousId?: string; sessionId?: string }
  | { eventName: "SEARCH_SUBMITTED"; path: string; queryLengthBucket: "short" | "medium" | "long"; anonymousId?: string; sessionId?: string };
