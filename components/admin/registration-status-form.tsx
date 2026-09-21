"use client";

import { useActionState } from "react";
import { updateEventRegistrationStatus, registrationAdminInitialState } from "@/lib/admin/registration-actions";

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "REJECTED"] as const;

export function RegistrationStatusForm({ eventId, registrationId, currentStatus }: { eventId: string; registrationId: string; currentStatus: string }) {
  const [state, action, pending] = useActionState(updateEventRegistrationStatus, registrationAdminInitialState);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="registrationId" value={registrationId} />
      <div>
        <label htmlFor="registration-admin-status" className="text-xs font-medium">Status</label>
        <select id="registration-admin-status" name="status" defaultValue={currentStatus} className="mt-1 block min-h-10 border border-border bg-background px-3 py-2 text-sm">
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <button type="submit" disabled={pending} className="min-h-10 border border-border px-4 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-50">{pending ? "Saving…" : "Update status"}</button>
      {state.error && <p className="basis-full text-sm text-destructive" role="alert">{state.error}</p>}
      {state.message && <p className="basis-full text-sm" role="status">{state.message}</p>}
    </form>
  );
}
