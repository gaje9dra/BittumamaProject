export default function Home() {
  return (
    <main className="min-h-screen px-[var(--page-gutter)] py-16">
      <div className="mx-auto w-full max-w-[var(--container-content)]">
        <p className="text-[length:var(--font-size-body-sm)] text-[var(--muted)]">
          Project Foundation
        </p>
        <h1 className="mt-2 text-[length:var(--font-size-h1)] font-semibold tracking-tight sm:text-[length:var(--font-size-display)]">
          Project initialized successfully.
        </h1>
      </div>
    </main>
  );
}
