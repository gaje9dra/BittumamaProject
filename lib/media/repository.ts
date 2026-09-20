import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const MEDIA_PAGE_SIZE = 24;

const usageInclude = {
  _count: { select: { articleCovers: true, expertProfiles: true, researchImages: true, eventCovers: true } },
} as const;

export async function listMedia(options: { q?: string; status?: "ACTIVE" | "ARCHIVED"; page?: number; pageSize?: number } = {}) {
  const pageSize = Math.min(Math.max(options.pageSize ?? MEDIA_PAGE_SIZE, 1), 48);
  const page = Math.max(options.page ?? 1, 1);
  const q = options.q?.trim();
  const where: Prisma.MediaAssetWhereInput = {
    ...(options.status ? { status: options.status } : {}),
    ...(q ? { OR: [
      { originalFilename: { contains: q, mode: "insensitive" } },
      { normalizedFilename: { contains: q, mode: "insensitive" } },
      { altText: { contains: q, mode: "insensitive" } },
      { caption: { contains: q, mode: "insensitive" } },
    ] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.client.mediaAsset.findMany({ where, include: usageInclude, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.client.mediaAsset.count({ where }),
  ]);
  return {
    items: items.map((item) => ({
      ...item,
      usageCount: item._count.articleCovers + item._count.expertProfiles + item._count.researchImages + item._count.eventCovers,
      referenced: item._count.articleCovers + item._count.expertProfiles + item._count.researchImages + item._count.eventCovers > 0,
    })),
    total, page, pageSize,
  };
}

export async function searchActiveMedia(q: string) {
  const value = q.trim();
  if (value.length < 2) return [];
  return prisma.client.mediaAsset.findMany({
    where: { status: "ACTIVE", OR: [
      { originalFilename: { contains: value, mode: "insensitive" } },
      { normalizedFilename: { contains: value, mode: "insensitive" } },
      { altText: { contains: value, mode: "insensitive" } },
    ] },
    select: { id: true, originalFilename: true, normalizedFilename: true, mimeType: true, width: true, height: true, publicUrl: true, altText: true },
    orderBy: { createdAt: "desc" }, take: 20,
  });
}

export async function getMediaById(id: string) {
  return prisma.client.mediaAsset.findUnique({ where: { id }, include: usageInclude });
}

export async function getMediaUsage(id: string) {
  const [articles, experts, research, events] = await Promise.all([
    prisma.client.article.findMany({ where: { coverMediaId: id }, select: { id: true, title: true, slug: true } }),
    prisma.client.expert.findMany({ where: { profileMediaId: id }, select: { id: true, name: true, slug: true } }),
    prisma.client.researchItem.findMany({ where: { imageMediaId: id }, select: { id: true, title: true, slug: true } }),
    prisma.client.event.findMany({ where: { coverMediaId: id }, select: { id: true, title: true, slug: true } }),
  ]);
  return { articles, experts, research, events };
}

export async function getMediaOrphanReport() {
  const media = await prisma.client.mediaAsset.findMany({ select: { id: true, storageKey: true, mimeType: true, publicUrl: true, status: true }, orderBy: { createdAt: "asc" } });
  return Promise.all(media.map(async (item) => {
    const counts = await Promise.all([
      prisma.client.article.count({ where: { coverMediaId: item.id } }),
      prisma.client.expert.count({ where: { profileMediaId: item.id } }),
      prisma.client.researchItem.count({ where: { imageMediaId: item.id } }),
      prisma.client.event.count({ where: { coverMediaId: item.id } }),
    ]);
    return { ...item, usageCount: counts.reduce((sum, n) => sum + n, 0) };
  }));
}
