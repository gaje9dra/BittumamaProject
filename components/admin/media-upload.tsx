"use client";

import { useRef, useState } from "react";

export function MediaUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "Uploading…" | "Processing…" | "Uploaded.">("idle");
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setState("Uploading…");
    const formData = new FormData();
    formData.set("file", file);
    try {
      setState("Processing…");
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const payload = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error || "Upload failed. Please try again.");
      setState("Uploaded.");
      window.location.reload();
    } catch (error) {
      setState("idle");
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload image" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
    <button type="button" onClick={() => inputRef.current?.click()} disabled={state === "Uploading…" || state === "Processing…"} className="bg-foreground px-4 py-2.5 text-sm font-medium text-background">{state === "idle" ? "Upload image" : state}</button>
    {error && <p className="mt-2 text-xs text-destructive" role="alert">{error}</p>}
  </div>;
}
