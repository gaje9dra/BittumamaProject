import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_INTENT_COOKIE = "bittumama_admin_intent";
export const ADMIN_CONTEXT_COOKIE = "bittumama_admin_context";

const ADMIN_INTENT_MAX_AGE = 10 * 60;
const ADMIN_CONTEXT_MAX_AGE = 8 * 60 * 60;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is required for admin authentication context.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function createToken(ttlSeconds: number) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${issuedAt}.${ttlSeconds}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined, expectedMaxAge: number) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAtText, ttlText, signature] = parts;
  const issuedAt = Number(issuedAtText);
  const ttl = Number(ttlText);
  if (!Number.isSafeInteger(issuedAt) || !Number.isSafeInteger(ttl) || ttl !== expectedMaxAge) return false;
  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now + 30 || now - issuedAt > expectedMaxAge) return false;

  const expected = sign(`${issuedAt}.${ttl}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function createAdminIntentToken() {
  return createToken(ADMIN_INTENT_MAX_AGE);
}

export function createAdminContextToken() {
  return createToken(ADMIN_CONTEXT_MAX_AGE);
}

export function isValidAdminIntent(token: string | undefined) {
  return verifyToken(token, ADMIN_INTENT_MAX_AGE);
}

export function isValidAdminContext(token: string | undefined) {
  return verifyToken(token, ADMIN_CONTEXT_MAX_AGE);
}

export const adminIntentCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin/login",
  maxAge: ADMIN_INTENT_MAX_AGE,
};

export const adminContextCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_CONTEXT_MAX_AGE,
};
