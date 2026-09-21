"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleSignIn({ callbackUrl = "/auth-test", admin = false }: { callbackUrl?: string; admin?: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSignIn() {
    setPending(true);
    setError(false);

    if (admin) {
      const response = await fetch("/api/auth/admin/context", { method: "POST", credentials: "same-origin" });
      if (!response.ok) {
        setPending(false);
        setError(true);
        return;
      }
    }

    await signIn("google", { callbackUrl });
    setPending(false);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground"
      >
        {pending ? "Redirecting…" : "Continue with Google"}
      </button>
      {error && <p className="type-caption text-error" role="alert">Administrator sign-in could not be started. Please try again later.</p>}
    </div>
  );
}
