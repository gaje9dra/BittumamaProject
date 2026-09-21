import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";

const DEFAULT_PAGE_SIZE = 20;
const VALID_ROLES = ["USER", "ADMIN"] as const;
type UserRoleValue = (typeof VALID_ROLES)[number];

export type UserListOptions = {
  q?: string;
  role?: UserRoleValue;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "name";
};

function isValidUserId(id: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

function normalizeRole(value: string | undefined): UserRoleValue | undefined {
  return value && VALID_ROLES.includes(value as UserRoleValue) ? (value as UserRoleValue) : undefined;
}

function buildWhere(options: UserListOptions): Prisma.UserWhereInput {
  const q = options.q?.trim();
  const role = normalizeRole(options.role);

  return {
    ...(role ? { role } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function listUsers(options: UserListOptions = {}) {
  await requireAdmin();

  const pageSize = Math.min(Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 5), 50);
  const page = Math.max(options.page ?? 1, 1);
  const where = buildWhere(options);

  const orderBy =
    options.sort === "oldest"
      ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
      : options.sort === "name"
        ? [{ name: "asc" as const }, { createdAt: "desc" as const }, { id: "asc" as const }]
        : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  const [items, total] = await Promise.all([
    prisma.client.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        accounts: { select: { provider: true }, orderBy: { provider: "asc" }, take: 1 },
        _count: { select: { contactInquiries: true } },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.client.user.count({ where }),
  ]);

  return {
    items: items.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      provider: user.accounts[0]?.provider ?? null,
      inquiryCount: user._count.contactInquiries,
    })),
    total,
    page,
    pageSize,
  };
}

export async function getUserById(id: string) {
  await requireAdmin();
  if (!isValidUserId(id)) return null;

  return prisma.client.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: { provider: true },
        orderBy: { provider: "asc" },
      },
      _count: { select: { contactInquiries: true } },
    },
  });
}

export async function getAdminCount() {
  await requireAdmin();
  return prisma.client.user.count({ where: { role: "ADMIN" } });
}
