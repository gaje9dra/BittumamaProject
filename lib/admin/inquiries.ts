import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";

const DEFAULT_PAGE_SIZE = 20;

export type InquiryListOptions = {
  q?: string;
  status?: "NEW" | "READ" | "IN_PROGRESS" | "RESOLVED" | "SPAM";
  serviceId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "updated";
};

function parseDateBoundary(value: string | undefined, endOfDay = false) {
  if (!value) return undefined;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function buildWhere(options: InquiryListOptions): Prisma.ContactInquiryWhereInput {
  const q = options.q?.trim();
  const submittedAt: Prisma.DateTimeFilter = {};
  const from = parseDateBoundary(options.from);
  const to = parseDateBoundary(options.to, true);
  if (from) submittedAt.gte = from;
  if (to) submittedAt.lte = to;

  return {
    ...(normalizeStatus(options.status) ? { status: normalizeStatus(options.status) } : {}),
    ...(options.serviceId ? { serviceId: options.serviceId } : {}),
    ...(from || to ? { submittedAt } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
            { service: { is: { title: { contains: q, mode: "insensitive" } } } },
            { service: { is: { slug: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };
}

const VALID_STATUSES = new Set(["NEW", "READ", "IN_PROGRESS", "RESOLVED", "SPAM"] as const);

function isValidInquiryId(id: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

function normalizeStatus(value: string | undefined): InquiryListOptions["status"] | undefined {
  return value && VALID_STATUSES.has(value as (typeof VALID_STATUSES extends Set<infer T> ? T : never))
    ? (value as InquiryListOptions["status"])
    : undefined;
}

export async function listInquiries(options: InquiryListOptions = {}) {
  await requireAdmin();
  const pageSize = Math.min(Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 5), 50);
  const page = Math.max(options.page ?? 1, 1);
  const where = buildWhere(options);
  const orderBy =
    options.sort === "oldest"
      ? { submittedAt: "asc" as const }
      : options.sort === "updated"
        ? { updatedAt: "desc" as const }
        : { submittedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.client.contactInquiry.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        service: { select: { id: true, title: true, slug: true } },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.client.contactInquiry.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getInquiryById(id: string) {
  await requireAdmin();
  if (!isValidInquiryId(id)) return null;

  return prisma.client.contactInquiry.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      status: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
      service: { select: { id: true, title: true, slug: true, status: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getInquirySummary() {
  await requireAdmin();
  const [newCount, inProgressCount, resolvedCount] = await Promise.all([
    prisma.client.contactInquiry.count({ where: { status: "NEW" } }),
    prisma.client.contactInquiry.count({ where: { status: "IN_PROGRESS" } }),
    prisma.client.contactInquiry.count({ where: { status: "RESOLVED" } }),
  ]);
  return { newCount, inProgressCount, resolvedCount };
}

export async function getInquiryServices() {
  await requireAdmin();
  return prisma.client.service.findMany({
    select: { id: true, title: true, slug: true, status: true },
    orderBy: { title: "asc" },
  });
}
