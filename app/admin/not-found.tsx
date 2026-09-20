import Link from "next/link";

export default function AdminNotFound() {
  return (
    <section className="max-w-2xl border border-border bg-surface p-6">
      <p className="type-label text-muted-foreground">Admin area</p>
      <h1 className="type-h3 mt-2">Page not found</h1>
      <p className="type-body-sm mt-3 text-muted-foreground">
        This admin destination does not exist.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 type-button text-primary-foreground hover:bg-primary-700"
      >
        Back to overview
      </Link>
    </section>
  );
}
