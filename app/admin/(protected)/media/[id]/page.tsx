import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMediaById, getMediaUsage } from "@/lib/media/repository";
import { MediaDetails } from "@/components/admin/media-details";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media detail | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMediaById(id);
  if (!media) notFound();
  const usage = await getMediaUsage(id);
  const usageCount = media._count.articleCovers + media._count.expertProfiles + media._count.researchImages + media._count.eventCovers;
  return <section aria-labelledby="media-detail-title">
    <Link href="/admin/media" className="type-caption text-muted-foreground underline underline-offset-4">← Back to Media</Link>
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)]">
      <div><div className="relative aspect-[16/10] overflow-hidden border border-border bg-surface-muted"><img src={media.publicUrl} alt={media.altText || ""} className="h-full w-full object-contain" /></div></div>
      <div><p className="type-label text-muted-foreground">Media asset</p><h1 id="media-detail-title" className="type-h2 mt-2 break-words">{media.originalFilename}</h1><dl className="mt-6 space-y-4 text-sm">
        <div><dt className="text-muted-foreground">Type</dt><dd>{media.mimeType}</dd></div><div><dt className="text-muted-foreground">Dimensions</dt><dd>{media.width ?? "—"} × {media.height ?? "—"}</dd></div><div><dt className="text-muted-foreground">Size</dt><dd>{(media.fileSize / 1024 / 1024).toFixed(2)} MB</dd></div><div><dt className="text-muted-foreground">Public URL</dt><dd className="break-all">{media.publicUrl}</dd></div><div><dt className="text-muted-foreground">Status</dt><dd>{media.status}</dd></div>
      </dl>
      <MediaDetails media={{ id: media.id, altText: media.altText, caption: media.caption, status: media.status }} usage={usage} usageCount={usageCount} />
      </div>
    </div>
  </section>;
}
