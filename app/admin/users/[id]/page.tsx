import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getUserById } from "@/lib/admin/users";
import { UserRoleForm } from "@/components/admin/user-role-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "User | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" }).format(value);
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, admin] = await Promise.all([params, requireAdmin()]);
  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <section aria-labelledby="user-title" className="max-w-4xl">
      <div className="border-b border-border pb-6">
        <Link href="/admin/users" className="text-sm underline underline-offset-4">← All users</Link>
        <p className="type-label mt-5 text-muted-foreground">User</p>
        <h1 id="user-title" className="type-h2 mt-2">{user.name || "Unnamed user"}</h1>
        <p className="mt-2 break-words text-sm text-muted-foreground">{user.email || "No email address"}</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="account-title">
            <h2 id="account-title" className="type-h5">Account</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</dt><dd className="mt-1 text-sm">{user.role === "ADMIN" ? "Admin" : "User"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Provider</dt><dd className="mt-1 text-sm">{user.accounts.map((account) => account.provider).join(", ") || "—"}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Created</dt><dd className="mt-1 text-sm">{formatDate(user.createdAt)}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Updated</dt><dd className="mt-1 text-sm">{formatDate(user.updatedAt)}</dd></div>
            </dl>
          </section>

          <section aria-labelledby="relationships-title">
            <h2 id="relationships-title" className="type-h5">Relationships</h2>
            <p className="mt-3 text-sm">{user._count.contactInquiries} associated contact {user._count.contactInquiries === 1 ? "inquiry" : "inquiries"}.</p>
            <p className="mt-2 text-xs text-muted-foreground">Full inquiry contents remain in the dedicated inquiry-management area.</p>
          </section>
        </div>

        <aside className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6">
          <h2 className="type-h5">Actions</h2>
          <div className="mt-4">
            <UserRoleForm targetUserId={user.id} currentRole={user.role} actorUserId={admin.id} />
          </div>
        </aside>
      </div>
    </section>
  );
}
