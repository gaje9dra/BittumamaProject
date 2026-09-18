export default function Home() {
  return (
    <main className="min-h-screen bg-background px-[var(--page-gutter)] py-[var(--space-page)] text-foreground">
      <div className="mx-auto w-full max-w-[var(--container-content)]">
        <p className="type-body-sm text-muted">Project Foundation</p>
        <h1 className="type-h1 mt-[var(--space-small)] font-semibold">
          Project initialized successfully.
        </h1>
      </div>
    </main>
  );
}
