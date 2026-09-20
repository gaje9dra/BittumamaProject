import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma/client";

export async function getCurrentSession() {
  return auth();
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=%2Fauth-test");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuthenticatedUser();

  if (user.role !== UserRole.ADMIN) {
    redirect("/login?error=AccessDenied");
  }

  return user;
}
