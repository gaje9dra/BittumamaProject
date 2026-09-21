"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <section role="alert" className="max-w-2xl border border-border bg-surface p-6">
      <p className="type-label text-error">Admin area</p>
      <h1 className="type-h3 mt-2">Something went wrong</h1>
      <p className="type-body-sm mt-3 text-muted-foreground">
        The admin area could not load safely. Try again or sign in again.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 type-button text-primary-foreground hover:bg-primary-700"
        >
          Try again
        </button>
        <a
          href="/login"
          className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-4 type-button hover:bg-surface-muted"
        >
          Sign in
        </a>
      </div>
    </section>
  );
}
