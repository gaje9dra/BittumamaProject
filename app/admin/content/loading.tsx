export default function AdminContentLoading() {
  return (
    <section aria-busy="true" className="space-y-6">
      <div className="h-8 w-56 animate-pulse bg-surface-muted" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse border border-border bg-surface" />
        ))}
      </div>
    </section>
  );
}
