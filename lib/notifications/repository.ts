import "server-only";

import type { Prisma, NotificationChannel, NotificationStatus, NotificationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { NotificationCreateInput } from "@/lib/notifications/types";

export type NotificationTx = Prisma.TransactionClient;

export async function createNotificationIntent(tx: NotificationTx, input: NotificationCreateInput) {
  const existing = await tx.notification.findUnique({ where: { dedupeKey: input.dedupeKey }, select: { id: true, status: true } });
  if (existing) return { created: false, notificationId: existing.id, status: existing.status };
  const record = await tx.notification.create({
    data: {
      userId: input.userId ?? null,
      type: input.type,
      channel: input.channel,
      status: "PENDING",
      subject: input.subject,
      recipient: input.recipient,
      relatedEntityType: input.relatedEntityType ?? null,
      relatedEntityId: input.relatedEntityId ?? null,
      payload: input.payload,
      dedupeKey: input.dedupeKey,
    },
    select: { id: true, status: true },
  });
  return { created: true, notificationId: record.id, status: record.status };
}

export async function getNotification(id: string) {
  return prisma.client.notification.findUnique({
    where: { id },
    select: {
      id: true, userId: true, type: true, channel: true, status: true, subject: true, recipient: true,
      relatedEntityType: true, relatedEntityId: true, payload: true, provider: true, providerMessageId: true,
      dedupeKey: true, scheduledFor: true, sentAt: true, failedAt: true, failureCode: true, failureMessage: true,
      createdAt: true, updatedAt: true,
    },
  });
}

export async function listAdminNotifications(options: { q?: string; status?: NotificationStatus; type?: NotificationType; page?: number; pageSize?: number } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(Math.max(options.pageSize ?? 20, 5), 50);
  const q = options.q?.trim();
  const where = {
    ...(options.status ? { status: options.status } : {}),
    ...(options.type ? { type: options.type } : {}),
    ...(q ? {
      OR: [
        { recipient: { contains: q, mode: "insensitive" as const } },
        { subject: { contains: q, mode: "insensitive" as const } },
        { relatedEntityId: { contains: q, mode: "insensitive" as const } },
      ],
    } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.client.notification.findMany({
      where,
      select: { id: true, type: true, channel: true, status: true, subject: true, recipient: true, provider: true, providerMessageId: true, relatedEntityType: true, relatedEntityId: true, createdAt: true, sentAt: true, failedAt: true, failureCode: true },
      orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize,
    }),
    prisma.client.notification.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function listUserNotifications(userId: string, page = 1, pageSize = 20) {
  const safePage = Math.min(Math.max(page, 1), 100);
  const safeSize = Math.min(Math.max(pageSize, 5), 50);
  const where = { userId };
  const [items, total] = await Promise.all([
    prisma.client.notification.findMany({
      where,
      select: {
        id: true,
        type: true,
        channel: true,
        status: true,
        subject: true,
        relatedEntityType: true,
        relatedEntityId: true,
        createdAt: true,
        sentAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }),
    prisma.client.notification.count({ where }),
  ]);
  return { items, total, page: safePage, pageSize: safeSize, totalPages: Math.max(1, Math.ceil(total / safeSize)) };
}
