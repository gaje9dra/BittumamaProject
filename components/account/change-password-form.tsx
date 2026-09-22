"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });

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

  const field = (
    key: "current" | "next" | "confirm",
    label: string,
    value: string,
    setValue: (value: string) => void,
    autocomplete: "current-password" | "new-password",
  ) => (
    <label className="block type-caption font-medium">
      {label}
      <span className="relative mt-2 block">
        <input
          required
          minLength={key === "current" ? undefined : 10}
          type={visible[key] ? "text" : "password"}
          autoComplete={autocomplete}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-12 w-full border border-input bg-transparent px-3.5 py-3 pr-12 focus:border-ring focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((state) => ({ ...state, [key]: !state[key] }))}
          aria-label={visible[key] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {visible[key] ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
        </button>
      </span>
    </label>
  );

  return (
    <form onSubmit={submit} className="space-y-5" noValidate aria-busy={pending}>
      {field("current", "Current password", current, setCurrent, "current-password")}
      {field("next", "New password", next, setNext, "new-password")}
      {field("confirm", "Confirm new password", confirm, setConfirm, "new-password")}
      <p className="type-caption text-muted-foreground">Use at least 10 characters.</p>
      {message && <p role="status" aria-live="polite" className="border-l-2 border-border px-3 py-2 type-caption">{message}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground disabled:opacity-60">
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
