import type { ContentStatus } from "@/generated/prisma/client";

export const PUBLIC_CONTENT_STATUS: ContentStatus = "PUBLISHED";

export function isPublicContentStatus(status: ContentStatus): boolean {
  return status === PUBLIC_CONTENT_STATUS;
}
