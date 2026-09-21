"use client";

import { useActionState } from "react";
import { cancelEventRegistration } from "@/lib/events/registration-actions";
import type { RegistrationActionState } from "@/lib/events/registration";

const initialState: RegistrationActionState = { ok: false, message: null, fieldErrors: {} };

export function EventRegistrationCancel({ registrationId, eventSlug }: { registrationId: string; eventSlug: string }) {
  const [state, action, pending] = useActionState(cancelEventRegistration, initialState);
  return (
    <form action={action} className="mt-4">
      <input type="hidden" name="registrationId" value={registrationId} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      {state.message && <p className="mb-3 text-sm text-muted-foreground" role={state.ok ? "status" : "alert"}>{state.message}</p>}
      <button type="submit" disabled={pending} className="type-button border border-border px-4 py-2.5 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-50" onClick={(event) => { if (!window.confirm("Cancel your registration for this event?")) event.preventDefault(); }}>
        {pending ? "Cancelling…" : "Cancel registration"}
      </button>
    </form>
  );
}
