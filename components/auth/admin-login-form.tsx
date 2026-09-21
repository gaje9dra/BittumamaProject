"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(typeof body?.error === "string" ? body.error : "Invalid administrator credentials.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to complete administrator sign in. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate aria-busy={pending}>
      <div>
        <label htmlFor="admin-email" className="block type-caption font-medium">Admin email</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" inputMode="email" required value={email} onChange={(event) => setEmail(event.target.value)}
          className="motion-focus mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 text-sm transition-colors duration-[var(--motion-fast)] focus:border-ring focus:outline-none" />
      </div>
      <div>
        <label htmlFor="admin-password" className="block type-caption font-medium">Admin password</label>
        <div className="relative mt-2">
          <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)}
            aria-describedby={error ? "admin-login-error" : undefined} className="motion-focus min-h-12 w-full border border-input bg-transparent px-3.5 py-3 pr-12 text-sm transition-colors duration-[var(--motion-fast)] focus:border-ring focus:outline-none" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide admin password" : "Show admin password"}
            className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2">
            {showPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
          </button>
        </div>
      </div>
      {error && <p id="admin-login-error" role="alert" aria-live="polite" className="border-l-2 border-error px-3 py-2 type-caption text-error">{error}</p>}
      <button type="submit" disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
