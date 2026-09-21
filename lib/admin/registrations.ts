import "server-only";

import { EventRegistrationRecordStatus, Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

const statuses = Object.values(EventRegistrationRecordStatus);

function validId(value: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

export async function getAdminEventRegistrationSummary(eventId: string) {
  await requireAdmin();
  if (!validId(eventId)) return null;
  const event = await prisma.client.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, slug: true, registrationCapacity: true, registrationEnabled: true, registrationDeadline: true },
  });
  if (!event) return null;
  const count = await prisma.client.eventRegistration.count({
    where: { eventId, status: { in: [EventRegistrationRecordStatus.PENDING, EventRegistrationRecordStatus.CONFIRMED] } },
  });
  return { ...event, count, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0) };
}

export async function listEventRegistrations(eventId: string, options: { q?: string; status?: string; page?: number; pageSize?: number } = {}) {
  await requireAdmin();
  if (!validId(eventId)) return { items: [], total: 0, page: 1, pageSize: 20 };
  const pageSize = Math.min(Math.max(options.pageSize ?? 20, 5), 50);
  const page = Math.max(options.page ?? 1, 1);
  const status = statuses.includes(options.status as EventRegistrationRecordStatus) ? options.status as EventRegistrationRecordStatus : undefined;
  const q = options.q?.trim();
  const where: Prisma.EventRegistrationWhereInput = {
    eventId,
    ...(status ? { status } : {}),
    ...(q ? { OR: [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { organization: { contains: q, mode: "insensitive" } },
    ] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.client.eventRegistration.findMany({
      where,
      select: { id: true, fullName: true, email: true, phone: true, organization: true, notes: true, status: true, createdAt: true, updatedAt: true, userId: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.client.eventRegistration.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function getAdminRegistration(eventId: string, registrationId: string) {
  await requireAdmin();
  if (!validId(eventId) || !validId(registrationId)) return null;
  return prisma.client.eventRegistration.findFirst({
    where: { id: registrationId, eventId },
    select: {
      id: true, eventId: true, userId: true, fullName: true, email: true, phone: true,
      organization: true, notes: true, status: true, createdAt: true, updatedAt: true,
      event: { select: { id: true, title: true, slug: true, date: true, registrationCapacity: true } },
    },
  });
}
