"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function passwordStrength(password: string) {
  if (password.length < 10) return { label: "Too short", tone: "text-error" };
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 14) score++;
  if (score >= 4) return { label: "Strong", tone: "text-success" };
  if (score >= 2) return { label: "Acceptable", tone: "text-warning" };
  return { label: "Acceptable", tone: "text-warning" };
}

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = useMemo(() => passwordStrength(password), [password]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, name, password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(typeof body?.error === "string" ? body.error : "Unable to create the account.");
        return;
      }
      router.replace("/account");
      router.refresh();
    } catch {
      setError("Unable to create the account. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate aria-busy={pending}>
      <div>
        <label htmlFor="register-name" className="block type-caption font-medium">Name <span className="text-muted-foreground">(optional)</span></label>
        <input id="register-name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)}
          className="motion-focus mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 text-sm transition-colors duration-[var(--motion-fast)] focus:border-ring focus:outline-none" />
      </div>
      <div>
        <label htmlFor="register-email" className="block type-caption font-medium">Email</label>
        <input id="register-email" name="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(event) => setEmail(event.target.value)}
          className="motion-focus mt-2 min-h-12 w-full border border-input bg-transparent px-3.5 py-3 text-sm transition-colors duration-[var(--motion-fast)] focus:border-ring focus:outline-none" />
      </div>
      <div>
        <label htmlFor="register-password" className="block type-caption font-medium">Password</label>
        <div className="relative mt-2">
          <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={10} required value={password} onChange={(event) => setPassword(event.target.value)}
            aria-describedby="register-password-help" className="motion-focus min-h-12 w-full border border-input bg-transparent px-3.5 py-3 pr-12 text-sm transition-colors duration-[var(--motion-fast)] focus:border-ring focus:outline-none" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2">
            {showPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
          </button>
        </div>
        <div id="register-password-help" className="mt-2 flex items-center justify-between gap-4 type-caption">
          <span className="text-muted-foreground">At least 10 characters.</span>
          {password && <span className={strength.tone} aria-live="polite">{strength.label}</span>}
        </div>
      </div>
      {error && <p role="alert" aria-live="polite" className="border-l-2 border-error px-3 py-2 type-caption text-error">{error}</p>}
      <button type="submit" disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
