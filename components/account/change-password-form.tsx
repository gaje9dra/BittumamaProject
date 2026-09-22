"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm }),
      });
      const body = await response.json().catch(() => null);
      setMessage(response.ok ? "Password updated." : (body?.error || "Unable to update your password."));
      if (response.ok) {
        setCurrent("");
        setNext("");
        setConfirm("");
      }
    } catch {
      setMessage("Unable to update your password. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate aria-busy={pending}>
      <label className="block type-caption font-medium">
        Current password
        <input required type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 focus:border-ring focus:outline-none" />
      </label>
      <label className="block type-caption font-medium">
        New password
        <input required minLength={10} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className="mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 focus:border-ring focus:outline-none" />
      </label>
      <label className="block type-caption font-medium">
        Confirm new password
        <input required minLength={10} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 focus:border-ring focus:outline-none" />
      </label>
      {message && <p role="status" aria-live="polite" className="border-l-2 border-border px-3 py-2 type-caption">{message}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground disabled:opacity-60">
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
