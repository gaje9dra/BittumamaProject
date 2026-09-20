"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="min-h-screen px-[var(--page-gutter)] py-16">
      <div className="mx-auto w-full max-w-[var(--container-content)]">
        <h1 className="text-[length:var(--font-size-h1)] font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-[length:var(--font-size-body)] text-[var(--muted)]">
          An unexpected error occurred while loading this page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[length:var(--font-size-button)] font-medium transition-colors hover:bg-[var(--surface)]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
