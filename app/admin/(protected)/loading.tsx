export default function AdminLoading() {
  return (
    <section aria-label="Loading admin area" aria-busy="true">
      <div className="max-w-3xl animate-pulse">
        <div className="h-3 w-20 rounded bg-surface-muted" />
        <div className="mt-3 h-10 w-64 rounded bg-surface-muted" />
        <div className="mt-4 h-5 w-full max-w-xl rounded bg-surface-muted" />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-28 border border-border bg-surface p-5 animate-pulse" />
        ))}
      </div>
    </section>
  );
}
