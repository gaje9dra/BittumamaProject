import type { ReactNode } from "react";
import Link from "next/link";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { SignOutButton } from "@/components/auth/sign-out";

type AdminIdentity = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
};

const navItems = [{ href: "/admin", label: "Overview" }];

export function AdminShell({ admin, children }: { admin: AdminIdentity; children: ReactNode }) {
  const displayName = admin.name?.trim() || admin.email || "Administrator";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[96rem]">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
          <div className="border-b border-border px-5 py-5">
            <Link href="/admin" className="type-h5 text-foreground" aria-label="Bittumama admin overview">
              Bittumama
            </Link>
            <p className="type-caption mt-1 text-muted-foreground">Administration</p>
          </div>
          <nav aria-label="Admin navigation" className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current="page"
                    className="block rounded-[var(--radius-md)] bg-surface-interactive px-3 py-2.5 type-nav text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-border p-4">
            <p className="truncate type-body-sm font-medium">{displayName}</p>
            {admin.email && <p className="mt-1 truncate type-caption text-muted-foreground">{admin.email}</p>}
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-border bg-surface lg:hidden">
            <div className="flex min-h-16 items-center justify-between gap-3 px-[var(--page-gutter)]">
              <div>
                <p className="type-h5">Bittumama</p>
                <p className="type-caption text-muted-foreground">Administration</p>
              </div>
              <AdminMobileNav displayName={displayName} email={admin.email} />
            </div>
          </header>

          <main className="px-[var(--page-gutter)] py-8 sm:py-10 lg:py-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
