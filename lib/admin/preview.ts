import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { ContentDomain } from "@/lib/admin/content";

const PREVIEW_TTL_SECONDS = 10 * 60;

function secret() {
  const value = process.env.PREVIEW_SECRET || process.env.AUTH_SECRET;
  if (!value) throw new Error("PREVIEW_SECRET or AUTH_SECRET is required for secure previews.");
  return value;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createPreviewToken(domain: ContentDomain, id: string) {
  const payload = encode(JSON.stringify({
    domain,
    id,
    exp: Math.floor(Date.now() / 1000) + PREVIEW_TTL_SECONDS,
  }));
  return payload + "." + sign(payload);
}

export function verifyPreviewToken(token: string, domain: ContentDomain, id: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      domain?: string;
      id?: string;
      exp?: number;
    };
    return parsed.domain === domain && parsed.id === id && typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const PREVIEW_TTL_MINUTES = PREVIEW_TTL_SECONDS / 60;
