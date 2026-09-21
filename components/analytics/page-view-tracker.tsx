"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClientEvent } from "@/lib/analytics/client";

let lastTrackedPath: string | null = null;
let lastTrackedAt = 0;

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api/") || pathname.startsWith("/_next/")) return;
    const now = Date.now();
    if (lastTrackedPath === pathname && now - lastTrackedAt < 1500) return;
    lastTrackedPath = pathname;
    lastTrackedAt = now;
    void trackClientEvent({ eventName: "PAGE_VIEW", path: pathname });
  }, [pathname]);
  return null;
}
