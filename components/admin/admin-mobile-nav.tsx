"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/notifications", label: "Notifications" },
];

export function AdminMobileNav({ displayName, email }: { displayName: string; email?: string | null }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <button ref={closeButtonRef} type="button" aria-expanded={open} aria-controls="admin-mobile-navigation" onClick={() => setOpen((value) => !value)} className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-3 type-button hover:bg-surface-muted">
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div id="admin-mobile-navigation" className="absolute right-0 top-12 z-[var(--layer-navigation)] w-[min(18rem,calc(100vw-2rem))] border border-border bg-surface p-4 shadow-[var(--shadow-md)]">
          <nav aria-label="Admin mobile navigation">
            <p className="type-caption text-muted-foreground">Signed in as</p>
            <p className="mt-1 truncate type-body-sm font-medium">{displayName}</p>
            {email && <p className="mt-1 truncate type-caption text-muted-foreground">{email}</p>}
            <ul className="mt-4 space-y-1 border-t border-border pt-3">
              {navItems.map((item) => (
                <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} className="block rounded-[var(--radius-md)] px-3 py-2.5 type-nav hover:bg-surface-interactive">{item.label}</Link></li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-4"><SignOutButton /></div>
          </nav>
        </div>
      )}
    </div>
  );
}
