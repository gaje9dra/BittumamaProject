"use client";

import { useActionState } from "react";
import { submitEventRegistration } from "@/lib/events/registration-actions";
import type { RegistrationActionState } from "@/lib/events/registration-types";
import { trackClientEvent } from "@/lib/analytics/client";

const initialState: RegistrationActionState = { ok: false, message: null, fieldErrors: {} };

export function EventRegistrationForm({
  eventId,
  eventSlug,
  authenticatedEmail,
}: {
  eventId: string;
  eventSlug: string;
  authenticatedEmail?: string | null;
}) {
  const [state, action, pending] = useActionState(submitEventRegistration, initialState);

  if (state.ok) {
    return (
      <div className="border-y border-border py-6" role="status">
        <p className="type-label text-primary">Registration confirmed</p>
        <p className="type-body-sm mt-2 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} onSubmit={() => trackClientEvent({ eventName: "REGISTRATION_STARTED", path: window.location.pathname, eventId })} className="border-y border-border py-6" aria-describedby="registration-message">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="registration-fullName" className="text-sm font-medium">Full name</label>
          <input id="registration-fullName" name="fullName" required minLength={2} maxLength={160} autoComplete="name" aria-invalid={Boolean(state.fieldErrors.fullName)} className="mt-1 block min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" />
          {state.fieldErrors.fullName && <p className="mt-1 text-sm text-destructive" role="alert">{state.fieldErrors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="registration-email" className="text-sm font-medium">Email</label>
          <input id="registration-email" name="email" type="email" required maxLength={320} defaultValue={authenticatedEmail ?? ""} autoComplete="email" aria-invalid={Boolean(state.fieldErrors.email)} className="mt-1 block min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" />
          {state.fieldErrors.email && <p className="mt-1 text-sm text-destructive" role="alert">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="registration-phone" className="text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></label>
          <input id="registration-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className="mt-1 block min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" />
          {state.fieldErrors.phone && <p className="mt-1 text-sm text-destructive" role="alert">{state.fieldErrors.phone}</p>}
        </div>
        <div>
          <label htmlFor="registration-organization" className="text-sm font-medium">Organization <span className="text-muted-foreground">(optional)</span></label>
          <input id="registration-organization" name="organization" maxLength={160} autoComplete="organization" className="mt-1 block min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="registration-notes" className="text-sm font-medium">Notes <span className="text-muted-foreground">(optional)</span></label>
          <textarea id="registration-notes" name="notes" maxLength={2000} rows={4} className="mt-1 block w-full border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" />
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="registration-website">Website</label>
        <input id="registration-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      {state.message && <p id="registration-message" className="mt-4 text-sm text-destructive" role="alert">{state.message}</p>}
      <button type="submit" disabled={pending} className="mt-5 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-50">
        {pending ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
