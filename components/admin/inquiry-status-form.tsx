"use client";

import { useActionState } from "react";
import { inquiryInitialState, updateInquiryStatus } from "@/lib/admin/inquiry-actions";

const statuses = [
  ["NEW", "New"],
  ["READ", "Read"],
  ["IN_PROGRESS", "In progress"],
  ["RESOLVED", "Resolved"],
  ["SPAM", "Spam"],
] as const;

export function InquiryStatusForm({ id, status }: { id: string; status: (typeof statuses)[number][0] }) {
  const [state, action, pending] = useActionState(updateInquiryStatus, inquiryInitialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor={`inquiry-status-${id}`} className="block text-xs font-medium text-muted-foreground">Status</label>
        <select
          id={`inquiry-status-${id}`}
          name="status"
          defaultValue={status}
          disabled={pending}
          className="mt-1 min-h-10 border border-border bg-background px-3 py-2 text-sm"
        >
          {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <button type="submit" disabled={pending} className="min-h-10 border border-border px-3 py-2 text-sm font-medium hover:bg-surface-interactive disabled:opacity-60">
        {pending ? "Saving…" : "Update"}
      </button>
      {state.message && <span className="text-xs text-muted-foreground" role="status">{state.message}</span>}
      {state.error && <span className="text-xs text-destructive" role="alert">{state.error}</span>}
    </form>
  );
}
