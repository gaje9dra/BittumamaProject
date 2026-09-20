"use client";

import { useState } from "react";

type MediaOption = {
  id: string;
  originalFilename: string;
  publicUrl: string;
  width: number | null;
  height: number | null;
  altText: string | null;
};

export function MediaPicker({ name, label, initial }: { name: string; label: string; initial?: MediaOption | null }) {
  const [selected, setSelected] = useState<MediaOption | null>(initial ?? null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaOption[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media?q=" + encodeURIComponent(value));
      const payload = await response.json() as { results?: MediaOption[] };
      setResults(payload.results ?? []);
    } finally { setLoading(false); }
  }

  return <fieldset className="space-y-3">
    <legend className="text-sm font-medium">{label}</legend>
    {selected ? (
      <div className="flex gap-3 border border-border p-3">
        <img src={selected.publicUrl} alt={selected.altText || ""} className="size-20 shrink-0 object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{selected.originalFilename}</p>
          <p className="text-xs text-muted-foreground">{selected.width ?? "—"}×{selected.height ?? "—"}</p>
          <button type="button" className="mt-2 text-xs underline underline-offset-4" onClick={() => setSelected(null)}>Clear</button>
        </div>
      </div>
    ) : <p className="text-xs text-muted-foreground">No managed media selected.</p>}
    <input type="hidden" name={name} value={selected?.id ?? ""} />
    <label htmlFor={name + "-search"} className="sr-only">{label} search</label>
    <input id={name + "-search"} value={query} onChange={(event) => void search(event.target.value)} placeholder="Search media…" className="w-full border border-border bg-background px-3 py-2.5 text-sm" />
    {loading && <p className="text-xs text-muted-foreground" role="status">Searching…</p>}
    {!loading && results.length > 0 && <div className="border border-border">{results.map((item) => (
      <button type="button" key={item.id} onClick={() => { setSelected(item); setResults([]); setQuery(""); }} className="flex w-full gap-3 border-b border-border p-2 text-left last:border-0 hover:bg-surface-interactive">
        <img src={item.publicUrl} alt="" className="size-12 object-cover" />
        <span className="min-w-0"><span className="block truncate text-sm">{item.originalFilename}</span><span className="block text-xs text-muted-foreground">{item.width ?? "—"}×{item.height ?? "—"}</span></span>
      </button>
    ))}</div>}
  </fieldset>;
}
