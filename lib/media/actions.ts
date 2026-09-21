"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { getMediaById, getMediaUsage } from "@/lib/media/repository";
import { getMediaStorage } from "@/lib/media/storage";
import { prisma } from "@/lib/db/prisma";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
import { recordAuditBestEffort } from "@/lib/audit/service";

export type MediaActionState = { message: string | null; error?: string };
const initial: MediaActionState = { message: null };

export async function updateMediaMetadata(_previous: MediaActionState = initial, formData: FormData): Promise<MediaActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim().slice(0, 500);
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 500);
  if (!id) return { message: null, error: "Media ID is required." };
  if (!(await getMediaById(id))) return { message: null, error: "Media asset not found." };
  await prisma.client.mediaAsset.update({ where: { id }, data: { altText: altText || null, caption: caption || null } });
  await recordAuditBestEffort(prisma.client, { action: AuditAction.MEDIA_UPDATED, category: AuditCategory.MEDIA, result: AuditResult.SUCCESS, summary: "Media metadata updated.", entityType: "MediaAsset", entityId: id, metadata: { mediaId: id }, actor: { userId: actor.id, type: "USER" } });
  revalidatePath("/admin/media");
  return { message: "Saved." };
}

export async function archiveMedia(_previous: MediaActionState = initial, formData: FormData): Promise<MediaActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!(await getMediaById(id))) return { message: null, error: "Media asset not found." };
  await prisma.client.mediaAsset.update({ where: { id }, data: { status: "ARCHIVED" } });
  await recordAuditBestEffort(prisma.client, { action: AuditAction.MEDIA_UPDATED, category: AuditCategory.MEDIA, result: AuditResult.SUCCESS, summary: "Media asset archived.", entityType: "MediaAsset", entityId: id, metadata: { mediaId: id, state: "ARCHIVED" }, actor: { userId: actor.id, type: "USER" } });
  revalidatePath("/admin/media");
  return { message: "Archived." };
}

export async function restoreMedia(_previous: MediaActionState = initial, formData: FormData): Promise<MediaActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!(await getMediaById(id))) return { message: null, error: "Media asset not found." };
  await prisma.client.mediaAsset.update({ where: { id }, data: { status: "ACTIVE" } });
  await recordAuditBestEffort(prisma.client, { action: AuditAction.MEDIA_UPDATED, category: AuditCategory.MEDIA, result: AuditResult.SUCCESS, summary: "Media asset restored.", entityType: "MediaAsset", entityId: id, metadata: { mediaId: id, state: "ACTIVE" }, actor: { userId: actor.id, type: "USER" } });
  revalidatePath("/admin/media");
  return { message: "Restored." };
}

export async function deleteMedia(_previous: MediaActionState = initial, formData: FormData): Promise<MediaActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const existing = await getMediaById(id);
  if (!existing) return { message: null, error: "Media asset not found." };
  const usage = await getMediaUsage(id);
  const usageCount = usage.articles.length + usage.experts.length + usage.research.length + usage.events.length;
  if (usageCount > 0) return { message: null, error: "This asset is currently in use and cannot be deleted." };
  try {
    await getMediaStorage().remove(existing.storageKey);
    await prisma.client.mediaAsset.delete({ where: { id } });
    await recordAuditBestEffort(prisma.client, { action: AuditAction.MEDIA_DELETED, category: AuditCategory.MEDIA, result: AuditResult.SUCCESS, summary: "Media asset deleted.", entityType: "MediaAsset", entityId: id, metadata: { mediaId: id, storageKey: existing.storageKey }, actor: { userId: actor.id, type: "USER" } });
  } catch (error) {
    console.error("Media deletion failed:", error);
    return { message: null, error: "The asset could not be deleted safely." };
  }
  revalidatePath("/admin/media");
  return { message: "Deleted." };
}
