import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import { ADMIN_CONTEXT_COOKIE, isValidAdminContext } from "@/lib/auth/admin-context";

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
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const store = await cookies();
  const context = store.get(ADMIN_CONTEXT_COOKIE)?.value;
  if (!isValidAdminContext(context)) {
    redirect("/admin/login");
  }

  const user = await prisma.client.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}
