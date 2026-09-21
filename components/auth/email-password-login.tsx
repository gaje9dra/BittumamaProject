"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export function EmailPasswordLogin({ callbackUrl = "/auth-test" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ email, password }) });
      const body = await response.json().catch(() => null);
      if (!response.ok) { setError(typeof body?.error === "string" ? body.error : "Invalid email or password."); return; }
      router.replace(callbackUrl);
      router.refresh();
    } catch { setError("Sign-in could not be completed. Please try again."); }
    finally { setPending(false); }
  }

  return <form onSubmit={submit} className="space-y-5" noValidate>
    <div><label htmlFor="login-email" className="block type-caption font-medium">Email</label><input id="login-email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm" /></div>
    <div><label htmlFor="login-password" className="block type-caption font-medium">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm" /></div>
    {error && <p role="alert" className="type-caption text-error">{error}</p>}
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}
