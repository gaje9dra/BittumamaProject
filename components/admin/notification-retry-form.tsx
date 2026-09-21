"use client";

import { useActionState } from "react";
import { notificationActionInitialState, retryNotificationAsAdmin } from "@/lib/admin/notification-actions";

export function NotificationRetryForm({ id, eligible }: { id: string; eligible: boolean }) {
  const [state, action, pending] = useActionState(retryNotificationAsAdmin, notificationActionInitialState);
  if (!eligible) return null;
  return <div className="mt-7 border-t border-border pt-6"><form action={action}><input type="hidden" name="id" value={id} /><button type="submit" disabled={pending} className="min-h-11 border border-primary px-4 type-button text-primary hover:bg-surface-interactive disabled:opacity-60">{pending ? "Retrying…" : "Retry notification"}</button></form>{state.error && <p role="alert" className="mt-3 type-body-sm text-destructive">{state.error}</p>}{state.message && <p role="status" className="mt-3 type-body-sm text-muted-foreground">{state.message}</p>}</div>;
}