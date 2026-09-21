import type { Metadata } from "next";
import Link from "next/link";
import { listUsers } from "@/lib/admin/users";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Users | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

type SearchParams = Promise<{
  q?: string;
  role?: "USER" | "ADMIN";
  page?: string;
  sort?: "newest" | "oldest" | "name";
}>;

const roleLabels = { USER: "User", ADMIN: "Admin" } as const;

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const query = search.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const result = await listUsers({
    q: params.q,
    role: params.role,
    page,
    sort: params.sort,
  });

  const totalPages = Math.max(Math.ceil(result.total / result.pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const common = { q: params.q, role: params.role, sort: params.sort };

  return (
    <section aria-labelledby="users-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-label text-muted-foreground">Administration</p>
          <h1 id="users-title" className="type-h2 mt-2">Users</h1>
          <p className="type-body-sm mt-3 text-muted-foreground">View authenticated accounts and manage administrative access.</p>
        </div>
        <p className="text-sm text-muted-foreground">{result.total} {result.total === 1 ? "user" : "users"}</p>
      </div>

      <form method="get" className="mt-6 grid gap-3 border-y border-border py-4 md:grid-cols-[minmax(16rem,1fr)_auto_auto]">
        <div>
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input id="user-search" name="q" defaultValue={params.q ?? ""} placeholder="Search users…" className="min-h-10 w-full border border-border bg-background px-3 py-2.5 text-sm" />
        </div>
        <select name="role" defaultValue={params.role ?? ""} aria-label="Filter by role" className="min-h-10 border border-border bg-background px-3 py-2.5 text-sm">
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
        <button className="min-h-10 border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-interactive">Search</button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">Showing page {safePage} of {totalPages}</p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort</span>
          <Link href={buildHref({ ...common, sort: "newest" })} className="underline underline-offset-4">Newest</Link>
          <Link href={buildHref({ ...common, sort: "oldest" })} className="underline underline-offset-4">Oldest</Link>
          <Link href={buildHref({ ...common, sort: "name" })} className="underline underline-offset-4">Name</Link>
        </div>
      </div>

      {result.items.length === 0 ? (
        <div className="mt-6 border-y border-border py-12 text-sm text-muted-foreground">
          {params.q || params.role ? "No users match your search." : "No users found."}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-3 py-3 font-medium">Name</th>
                <th scope="col" className="px-3 py-3 font-medium">Email</th>
                <th scope="col" className="px-3 py-3 font-medium">Role</th>
                <th scope="col" className="px-3 py-3 font-medium">Provider</th>
                <th scope="col" className="px-3 py-3 font-medium">Created</th>
                <th scope="col" className="px-3 py-3 font-medium">Inquiries</th>
                <th scope="col" className="px-3 py-3 font-medium"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface-interactive">
                  <td className="px-3 py-4 font-medium">{user.name || "Unnamed user"}</td>
                  <td className="px-3 py-4 break-all">{user.email || "—"}</td>
                  <td className="px-3 py-4"><span className="inline-flex border border-border px-2 py-1 text-xs font-medium">{roleLabels[user.role]}</span></td>
                  <td className="px-3 py-4 text-muted-foreground">{user.provider || "—"}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="px-3 py-4">{user.inquiryCount}</td>
                  <td className="px-3 py-4 text-right"><Link href={`/admin/users/${user.id}`} className="font-medium underline underline-offset-4">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Page {safePage} of {totalPages}</span>
        <div className="flex gap-2">
          {safePage > 1 && <Link href={buildHref({ ...common, page: String(safePage - 1) })} className="border border-border px-3 py-2">Previous</Link>}
          {safePage < totalPages && <Link href={buildHref({ ...common, page: String(safePage + 1) })} className="border border-border px-3 py-2">Next</Link>}
        </div>
      </div>
    </section>
  );
}
