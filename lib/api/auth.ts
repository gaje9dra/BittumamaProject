import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import type { ApiActor } from "@/lib/api/types";
import { ADMIN_CONTEXT_COOKIE, isValidAdminContext } from "@/lib/auth/admin-context";

export async function getApiActor(): Promise<ApiActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.client.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireApiUser(): Promise<ApiActor> {
  const actor = await getApiActor();
  if (!actor) throw new Error("UNAUTHENTICATED");
  return actor;
}

export async function requireApiAdmin(): Promise<ApiActor> {
  const actor = await requireApiUser();
  if (actor.role !== "ADMIN") throw new Error("FORBIDDEN");

  const store = await cookies();
  const context = store.get(ADMIN_CONTEXT_COOKIE)?.value;
  if (!isValidAdminContext(context)) throw new Error("FORBIDDEN");

  return actor;
}
