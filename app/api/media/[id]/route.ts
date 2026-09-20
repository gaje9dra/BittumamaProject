import { NextResponse } from "next/server";
import { getMediaById } from "@/lib/media/repository";
import { getMediaStorage } from "@/lib/media/storage";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMediaById(id);
  if (!media || media.status === "ARCHIVED") return new NextResponse("Not found", { status: 404 });
  try {
    const stream = await getMediaStorage().getStream(media.storageKey);
    return new Response(stream as unknown as BodyInit, { headers: {
      "Content-Type": media.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": 'inline; filename="' + media.normalizedFilename.replace(/["\\\\]/g, "") + '"',
    }});
  } catch { return new NextResponse("Not found", { status: 404 }); }
}
