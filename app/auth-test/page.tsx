import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { SignOutButton } from "@/components/auth/sign-out";

export const dynamic = "force-dynamic";

export default async function AuthTestPage() {
  const user = await requireAuthenticatedUser();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-2xl px-[var(--page-gutter)] py-16">
        <p className="type-label text-muted-foreground">Internal authentication test</p>
        <h1 className="type-h2 mt-2">Authenticated access</h1>
        <p className="type-body-sm mt-3 text-muted-foreground">
          This is a minimal verification surface, not an admin dashboard or user account area.
        </p>
        <dl className="mt-8 grid gap-4 border-y border-border py-6 type-body-sm">
          <div><dt className="text-muted-foreground">User ID</dt><dd className="mt-1 break-all">{user.id}</dd></div>
          <div><dt className="text-muted-foreground">Email</dt><dd className="mt-1">{user.email ?? "Not provided"}</dd></div>
          <div><dt className="text-muted-foreground">Role</dt><dd className="mt-1">{user.role}</dd></div>
        </dl>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/auth-test/admin" className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-4 type-button hover:bg-surface-muted">Test admin guard</a>
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
