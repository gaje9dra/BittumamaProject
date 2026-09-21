"use client";

import { useActionState } from "react";
import { reconcilePaymentAsAdmin, paymentReconciliationInitialState } from "@/lib/admin/payment-actions";

export function PaymentReconcileForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(reconcilePaymentAsAdmin, paymentReconciliationInitialState);
  return (
    <div className="mt-7 border-t border-border pt-6">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" disabled={pending} className="min-h-11 border border-primary px-4 type-button text-primary hover:bg-surface-interactive disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? "Reconciling…" : "Reconcile with provider"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-3 type-body-sm text-destructive">{state.error}</p>}
      {state.message && <p role="status" className="mt-3 type-body-sm text-muted-foreground">{state.message}</p>}
      <p className="mt-3 type-caption text-muted-foreground">This action asks the configured provider for its current verified state. It never sets SUCCESS directly.</p>
    </div>
  );
}