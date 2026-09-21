"use client";

import type { AnalyticsClientEvent } from "@/lib/analytics/client-types";

const ANONYMOUS_KEY = "bittumama:analytics:anonymous";
const SESSION_KEY = "bittumama:analytics:session";

function randomId(key: string) {
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  sessionStorage.setItem(key, value);
  return value;
}

export function trackClientEvent(event: AnalyticsClientEvent) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      ...event,
      anonymousId: randomId(ANONYMOUS_KEY),
      sessionId: randomId(SESSION_KEY),
    });
    void fetch("/api/analytics/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics must never interfere with the public application.
  }
}
