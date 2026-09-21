import "server-only";

import { auth } from "@/auth";
import type { ApiActor } from "@/lib/api/types";

export async function getApiActor(): Promise<ApiActor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
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
  return actor;
}
