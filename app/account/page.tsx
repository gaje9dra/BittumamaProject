import type { Metadata } from "next";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { listUserRegistrations } from "@/lib/events/registration";
import { listUserPayments } from "@/lib/payments/repository";
import { listUserNotifications } from "@/lib/notifications/repository";
import { SignOutButton } from "@/components/auth/sign-out";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account | Bittumama",
  robots: { index: false, follow: false },
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);
}

function formatAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amountMinor / 100);
}

export default async function AccountPage() {
  const sessionUser = await requireAuthenticatedUser("/account");
  const user = await prisma.client.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true, passwordHash: true },
  });

  if (!user) return null;

  const [registrations, payments, notifications] = await Promise.all([
    listUserRegistrations(user.id, 1, 8),
    listUserPayments(user.id, 1, 8),
    listUserNotifications(user.id, 1, 6),
  ]);

  return (
    <main className="min-h-[calc(100vh-var(--header-height-lg))] bg-background text-foreground">
      <div className="mx-auto max-w-[var(--container-wide)] px-[var(--page-gutter)] py-14 md:py-20">
        <header className="max-w-3xl border-b border-border pb-8">
          <p className="type-label text-muted-foreground">Account</p>
          <h1 className="type-h1 mt-3">Your account</h1>
          <p className="type-body mt-4 max-w-2xl text-muted-foreground">
            Manage your profile, security, registrations and payment history.
          </p>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.62fr)]">
          <div className="space-y-12">
            <section aria-labelledby="profile-heading" className="border-b border-border pb-10">
              <p id="profile-heading" className="type-label text-muted-foreground">Profile</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="type-caption text-muted-foreground">Name</p>
                  <p className="mt-1 type-body">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="type-caption text-muted-foreground">Email</p>
                  <p className="mt-1 break-all type-body">{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="type-caption text-muted-foreground">Member since</p>
                  <p className="mt-1 type-body">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="security-heading" className="border-b border-border pb-10">
              <p id="security-heading" className="type-label text-muted-foreground">Security</p>
              <div className="mt-5 max-w-xl">
                <h2 className="type-h3">Authentication</h2>
                <p className="mt-2 type-body-sm text-muted-foreground">
                  {user.passwordHash ? "Email and password" : "Google sign-in"}
                </p>
                <div className="mt-7">
                  {user.passwordHash ? (
                    <ChangePasswordForm />
                  ) : (
                    <p className="border-l-2 border-border px-3 py-2 type-caption text-muted-foreground">
                      Your account uses Google sign-in. Password changes are not available for this account.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section aria-labelledby="registrations-heading" className="border-b border-border pb-10">
              <div className="flex items-baseline justify-between gap-4">
                <p id="registrations-heading" className="type-label text-muted-foreground">My registrations</p>
                <span className="type-caption text-muted-foreground">{registrations.total} total</span>
              </div>
              {registrations.items.length ? (
                <div className="mt-5 divide-y divide-border">
                  {registrations.items.map((item) => (
                    <article key={item.id} className="py-5 first:pt-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h2 className="type-h4">{item.event.title}</h2>
                        <span className="type-caption text-muted-foreground">{item.status}</span>
                      </div>
                      <p className="mt-1 type-caption text-muted-foreground">
                        {formatDate(item.event.date)} · Registered {formatDate(item.createdAt)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 type-body-sm text-muted-foreground">No registrations yet.</p>
              )}
            </section>

            <section aria-labelledby="payments-heading" className="border-b border-border pb-10">
              <div className="flex items-baseline justify-between gap-4">
                <p id="payments-heading" className="type-label text-muted-foreground">Payments</p>
                <span className="type-caption text-muted-foreground">{payments.total} total</span>
              </div>
              {payments.items.length ? (
                <div className="mt-5 divide-y divide-border">
                  {payments.items.map((item) => (
                    <article key={item.reference} className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-baseline">
                      <div>
                        <p className="type-button">{item.reference}</p>
                        <p className="mt-1 type-caption text-muted-foreground">{item.purpose} · {item.status}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="type-button">{formatAmount(item.amountMinor, item.currency)}</p>
                        <p className="mt-1 type-caption text-muted-foreground">{formatDate(item.createdAt)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 type-body-sm text-muted-foreground">No payments yet.</p>
              )}
            </section>

            <section aria-labelledby="notifications-heading" className="pb-4">
              <div className="flex items-baseline justify-between gap-4">
                <p id="notifications-heading" className="type-label text-muted-foreground">Notifications</p>
                <span className="type-caption text-muted-foreground">{notifications.total} total</span>
              </div>
              {notifications.items.length ? (
                <div className="mt-5 divide-y divide-border">
                  {notifications.items.map((item) => (
                    <article key={item.id} className="py-5 first:pt-0">
                      <p className="type-button">{item.subject || item.type.replaceAll("_", " ")}</p>
                      <p className="mt-1 type-caption text-muted-foreground">
                        {item.status} · {formatDate(item.createdAt)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 type-body-sm text-muted-foreground">No notifications yet.</p>
              )}
            </section>
          </div>

          <aside className="lg:border-l lg:border-border lg:pl-10">
            <div className="lg:sticky lg:top-24">
              <p className="type-label text-muted-foreground">Account actions</p>
              <div className="mt-4 flex flex-col items-start gap-2">
                <a href="#security-heading" className="type-button underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3">Security</a>
                <a href="#registrations-heading" className="type-button underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3">My registrations</a>
                <a href="#payments-heading" className="type-button underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3">Payments</a>
                <a href="#notifications-heading" className="type-button underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3">Notifications</a>
                <div className="pt-4">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
