import "server-only";

import type { PaymentPurpose, PaymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function getPaymentByReference(reference: string) {
  return prisma.client.paymentTransaction.findUnique({
    where: { reference },
    select: {
      id: true, reference: true, userId: true, eventId: true, registrationId: true, serviceId: true,
      provider: true, providerTransactionId: true, amountMinor: true, currency: true, purpose: true,
      status: true, description: true, failureCode: true, failureMessage: true, paidAt: true, createdAt: true, updatedAt: true,
      event: { select: { id: true, slug: true, title: true } },
      service: { select: { id: true, slug: true, title: true } },
      registration: { select: { id: true, eventId: true, status: true } },
    },
  });
}

export async function listUserPayments(userId: string, page = 1, pageSize = 20) {
  const safePage = Math.min(Math.max(page, 1), 100);
  const safeSize = Math.min(Math.max(pageSize, 5), 50);
  const where = { userId };
  const [items, total] = await Promise.all([
    prisma.client.paymentTransaction.findMany({
      where,
      select: {
        reference: true, amountMinor: true, currency: true, purpose: true, status: true, createdAt: true, paidAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }),
    prisma.client.paymentTransaction.count({ where }),
  ]);
  return { items, total, page: safePage, pageSize: safeSize, totalPages: Math.max(1, Math.ceil(total / safeSize)) };
}

export type AdminPaymentOptions = {
  q?: string;
  status?: PaymentStatus;
  provider?: string;
  page?: number;
  pageSize?: number;
};

export async function listAdminPayments(options: AdminPaymentOptions = {}) {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(Math.max(options.pageSize ?? 20, 5), 50);
  const q = options.q?.trim();
  const where = {
    ...(options.status ? { status: options.status } : {}),
    ...(options.provider ? { provider: options.provider } : {}),
    ...(q ? {
      OR: [
        { reference: { contains: q, mode: "insensitive" as const } },
        { providerTransactionId: { contains: q, mode: "insensitive" as const } },
      ],
    } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.client.paymentTransaction.findMany({
      where,
      select: {
        id: true, reference: true, provider: true, providerTransactionId: true, amountMinor: true, currency: true,
        purpose: true, status: true, failureCode: true, createdAt: true, paidAt: true,
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, slug: true, title: true } },
        service: { select: { id: true, slug: true, title: true } },
        registration: { select: { id: true, eventId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.client.paymentTransaction.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function getAdminPayment(id: string) {
  return prisma.client.paymentTransaction.findUnique({
    where: { id },
    select: {
      id: true, reference: true, userId: true, eventId: true, registrationId: true, serviceId: true,
      provider: true, providerTransactionId: true, amountMinor: true, currency: true, purpose: true, status: true,
      description: true, failureCode: true, failureMessage: true, paidAt: true, createdAt: true, updatedAt: true,
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, slug: true, title: true } },
      service: { select: { id: true, slug: true, title: true } },
      registration: { select: { id: true, eventId: true, status: true } },
    },
  });
}

export type PaymentCreateInput = {
  userId: string;
  target: { purpose: PaymentPurpose; serviceId?: string; eventId?: string; registrationId?: string };
  amountMinor: number;
  currency: string;
  provider: string;
  idempotencyKey: string;
  description?: string;
  metadata?: Record<string, string>;
};

function makeReference() {
  return "pay_" + crypto.randomUUID().replaceAll("-", "");
}

export async function createPaymentTransaction(input: PaymentCreateInput) {
  const existing = await prisma.client.paymentTransaction.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing) return { transaction: existing, created: false };

  const transaction = await prisma.client.paymentTransaction.create({
    data: {
      reference: makeReference(),
      idempotencyKey: input.idempotencyKey,
      userId: input.userId,
      serviceId: input.target.serviceId,
      eventId: input.target.eventId,
      registrationId: input.target.registrationId,
      purpose: input.target.purpose,
      amountMinor: input.amountMinor,
      currency: input.currency,
      provider: input.provider,
      description: input.description,
      metadata: input.metadata,
    },
  });
  return { transaction, created: true };
}