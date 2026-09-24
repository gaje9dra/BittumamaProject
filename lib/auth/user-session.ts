import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db/prisma";

const MAX_AGE = 30 * 24 * 60 * 60;
const COOKIE = "authjs.session-token";
const SECURE_COOKIE = "__Secure-authjs.session-token";

function cookieName() { return process.env.NODE_ENV === "production" ? SECURE_COOKIE : COOKIE; }

export async function createUserDatabaseSession(userId: string) {
  const sessionToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + MAX_AGE * 1000);
  await prisma.client.session.create({ data: { sessionToken, userId, expires } });
  const store = await cookies();
  store.set(cookieName(), sessionToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
}
