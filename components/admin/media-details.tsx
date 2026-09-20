"use client";

import { useActionState } from "react";
import { updateMediaMetadata, archiveMedia, restoreMedia, deleteMedia, type MediaActionState } from "@/lib/media/actions";

const initial: MediaActionState = { message: null };

export function MediaDetails({ media, usage, usageCount }: { media: { id: string; altText: string | null; caption: string | null; status: "ACTIVE" | "ARCHIVED" }; usage: { articles: { id: string; title: string; slug: string }[]; experts: { id: string; name: string; slug: string }[]; research: { id: string; title: string; slug: string }[]; events: { id: string; title: string; slug: string }[] }; usageCount: number }) {
  const [state, save] = useActionState(updateMediaMetadata, initial);
  const [, archive] = useActionState(archiveMedia, initial);
  const [, restore] = useActionState(restoreMedia, initial);
  const [, remove] = useActionState(deleteMedia, initial);
  return <div className="mt-8 space-y-6">
    <form action={save} className="space-y-4 border-t border-border pt-6">
      <input type="hidden" name="id" value={media.id} />
      <div><label htmlFor="altText" className="text-sm font-medium">Alt text</label><textarea id="altText" name="altText" defaultValue={media.altText ?? ""} maxLength={500} rows={3} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm" /><p className="mt-1 text-xs text-muted-foreground">Write meaningful alternative text for informative images; leave empty when decorative.</p></div>
      <div><label htmlFor="caption" className="text-sm font-medium">Caption</label><textarea id="caption" name="caption" defaultValue={media.caption ?? ""} maxLength={500} rows={3} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm" /></div>
      <button className="border border-border px-4 py-2.5 text-sm font-medium">Save metadata</button>{state.message && <p className="text-xs text-muted-foreground" role="status">{state.message}</p>}{state.error && <p className="text-xs text-destructive" role="alert">{state.error}</p>}
    </form>
    <div className="border-t border-border pt-6"><p className="type-label text-muted-foreground">Used by</p>{usageCount ? <ul className="mt-3 space-y-2 text-sm">{[
      ...usage.articles.map((x) => "Article: " + x.title),
      ...usage.experts.map((x) => "Expert: " + x.name),
      ...usage.research.map((x) => "Research: " + x.title),
      ...usage.events.map((x) => "Workshop / Event: " + x.title),
    ].map((x) => <li key={x}>{x}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">Not referenced by managed content.</p>}</div>
    <div className="flex flex-wrap gap-3 border-t border-border pt-6">
      {media.status === "ACTIVE" ? <form action={archive}><input type="hidden" name="id" value={media.id}/><button className="border border-border px-4 py-2.5 text-sm">Archive</button></form> : <form action={restore}><input type="hidden" name="id" value={media.id}/><button className="border border-border px-4 py-2.5 text-sm">Restore</button></form>}
      {usageCount === 0 && <form action={remove}><input type="hidden" name="id" value={media.id}/><button className="border border-destructive px-4 py-2.5 text-sm text-destructive" onClick={(event) => { if (!window.confirm("Delete this unused media asset permanently?")) event.preventDefault(); }}>Delete</button></form>}
    </div>
  </div>;
}
