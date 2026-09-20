"use client";

import { useState } from "react";

type Option = { id: string; label: string; slug: string };

export function RelationshipPicker({
  name,
  label,
  initial,
  multiple = true,
  domain,
}: {
  name: string;
  label: string;
  initial: Option[];
  multiple?: boolean;
  domain?: string;
}) {
  const [selected, setSelected] = useState<Option[]>(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/content/search?domain=" + encodeURIComponent(domain ?? domainForName(name)) + "&q=" + encodeURIComponent(value));
      const payload = (await response.json()) as { results?: Option[] };
      setResults(payload.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  function choose(option: Option) {
    setSelected((current) => {
      if (!multiple) return [option];
      return current.some((item) => item.id === option.id) ? current : [...current, option];
    });
    setResults([]);
    setQuery("");
  }

  function remove(id: string) {
    setSelected((current) => current.filter((item) => item.id !== id));
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      {selected.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-3 border border-border px-3 py-2 text-sm">
          <span>{item.label} <span className="text-muted-foreground">· {item.slug}</span></span>
          <button type="button" onClick={() => remove(item.id)} className="underline underline-offset-4">Remove</button>
          <input type="hidden" name={name} value={item.id} />
        </div>
      ))}
      <label className="sr-only" htmlFor={name + "-search"}>{label} search</label>
      <input
        id={name + "-search"}
        value={query}
        onChange={(event) => void search(event.target.value)}
        placeholder={"Search " + label.toLowerCase() + "…"}
        className="block w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
      />
      <div className="border border-border" aria-live="polite">
        {loading && <p className="px-3 py-2 text-xs text-muted-foreground">Searching…</p>}
        {!loading && results.map((result) => (
          <button key={result.id} type="button" onClick={() => choose(result)} className="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-interactive">
            {result.label} <span className="text-muted-foreground">· {result.slug}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function domainForName(name: string) {
  if (name.includes("Service")) return "services";
  if (name.includes("Research")) return "research";
  if (name.includes("Expert")) return "experts";
  if (name.includes("Article")) return "articles";
  return "workshops";
}
