import { publishScheduledContent } from "../../lib/publishing/scheduler.ts";

export default async function handler() {
  const result = await publishScheduledContent(new Date());

  if (result.published.length > 0 && process.env.URL && process.env.SCHEDULER_SECRET) {
    const paths = new Set<string>(["/"]);
    for (const item of result.published) {
      const base = item.domain === "workshops" ? "/workshops" : "/" + item.domain;
      paths.add(base);
      paths.add(base + "/" + item.slug);
    }

    try {
      await fetch(new URL("/api/internal/revalidate", process.env.URL), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-scheduler-secret": process.env.SCHEDULER_SECRET,
        },
        body: JSON.stringify({ paths: Array.from(paths) }),
      });
    } catch (error) {
      console.error("Scheduled publication revalidation failed:", error);
    }
  }

  console.log(JSON.stringify({
    event: "scheduled-publication",
    published: result.published.length,
    failed: result.failed.length,
    failures: result.failed,
  }));
}

export const config = {
  schedule: "*/5 * * * *",
};
