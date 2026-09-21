import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { getMediaStorage } from "@/lib/media/storage";
import { validateImageFile } from "@/lib/media/validation";
import { AuditAction, AuditCategory, AuditResult } from "@/generated/prisma/client";
import { recordAuditBestEffort } from "@/lib/audit/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireAdmin();
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });
  const results = await prisma.client.mediaAsset.findMany({
    where: { status: "ACTIVE", OR: [
      { originalFilename: { contains: q, mode: "insensitive" } },
      { normalizedFilename: { contains: q, mode: "insensitive" } },
      { altText: { contains: q, mode: "insensitive" } },
    ] },
    select: { id: true, originalFilename: true, normalizedFilename: true, mimeType: true, width: true, height: true, publicUrl: true, altText: true },
    orderBy: { createdAt: "desc" }, take: 20,
  });
  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  const actor = await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  let validated: Awaited<ReturnType<typeof validateImageFile>>;
  try { validated = await validateImageFile(file); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 }); }

  const id = randomUUID();
  const storageKey = "images/" + id + "/" + validated.normalizedFilename;
  const publicUrl = "/api/media/" + id;
  try {
    await getMediaStorage().put({ storageKey, data: validated.buffer, mimeType: validated.mimeType });
    try {
      await prisma.client.mediaAsset.create({ data: {
        id, storageKey, publicUrl, originalFilename: file.name.slice(0, 255),
        normalizedFilename: validated.normalizedFilename, mimeType: validated.mimeType,
        fileSize: validated.buffer.byteLength, width: validated.detected.width, height: validated.detected.height,
      } });
      await recordAuditBestEffort(prisma.client, { action: AuditAction.MEDIA_CREATED, category: AuditCategory.MEDIA, result: AuditResult.SUCCESS, summary: "Media asset uploaded.", entityType: "MediaAsset", entityId: id, metadata: { mediaId: id, mimeType: validated.mimeType, fileSize: validated.buffer.byteLength }, actor: { userId: actor.id, type: "USER" } });
    } catch (error) {
      await getMediaStorage().remove(storageKey).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ success: true, id, publicUrl, width: validated.detected.width, height: validated.detected.height });
}
