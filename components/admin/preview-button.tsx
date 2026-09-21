"use client";

import { useFormStatus } from "react-dom";
import { createPreview } from "@/lib/admin/content-actions";

function PreviewSubmit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50">{pending ? "Opening…" : "Preview"}</button>;
}

export function PreviewButton({ domain, id }: { domain: string; id: string }) {
  return (
    <form action={createPreview}>
      <input type="hidden" name="domain" value={domain} />
      <input type="hidden" name="id" value={id} />
      <PreviewSubmit />
    </form>
  );
}
