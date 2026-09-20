import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminGuardTestPage() {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-2xl px-[var(--page-gutter)] py-16">
        <p className="type-label text-muted-foreground">Internal authorization test</p>
        <h1 className="type-h2 mt-2">Admin guard passed</h1>
        <p className="type-body-sm mt-3 text-muted-foreground">
          The trusted server-side role is ADMIN for this authenticated user.
        </p>
        <p className="type-caption mt-6 text-muted-foreground">User ID: {user.id}</p>
      </section>
    </main>
  );
}
