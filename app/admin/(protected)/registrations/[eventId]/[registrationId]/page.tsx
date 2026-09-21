import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminRegistration } from "@/lib/admin/registrations";
import { RegistrationStatusForm } from "@/components/admin/registration-status-form";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Registration detail | Bittumama", robots: { index: false, follow: false, noarchive: true, nocache: true } };

export default async function RegistrationDetailPage({ params }: { params: Promise<{ eventId: string; registrationId: string }> }) {
  await requireAdmin();
  const { eventId, registrationId } = await params;
  const registration = await getAdminRegistration(eventId, registrationId);
  if (!registration) notFound();

  return (
    <section>
      <Link href={`/admin/registrations/${eventId}`} className="type-caption text-muted-foreground underline underline-offset-4">Back to registrations</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="type-label text-muted-foreground">Registration</p><h1 className="type-h2 mt-2">{registration.fullName}</h1><p className="type-body-sm mt-2 text-muted-foreground">{registration.event.title}</p></div>
        <RegistrationStatusForm eventId={eventId} registrationId={registration.id} currentStatus={registration.status} />
      </div>
      <dl className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-2">
        <div><dt className="type-label text-muted-foreground">Email</dt><dd className="mt-1 text-sm">{registration.email}</dd></div>
        <div><dt className="type-label text-muted-foreground">Phone</dt><dd className="mt-1 text-sm">{registration.phone || "—"}</dd></div>
        <div><dt className="type-label text-muted-foreground">Organization</dt><dd className="mt-1 text-sm">{registration.organization || "—"}</dd></div>
        <div><dt className="type-label text-muted-foreground">Account</dt><dd className="mt-1 text-sm">{registration.userId ? "Authenticated user" : "Anonymous visitor"}</dd></div>
        <div><dt className="type-label text-muted-foreground">Created</dt><dd className="mt-1 text-sm">{registration.createdAt.toLocaleString("en-IN")}</dd></div>
        <div><dt className="type-label text-muted-foreground">Updated</dt><dd className="mt-1 text-sm">{registration.updatedAt.toLocaleString("en-IN")}</dd></div>
        <div className="sm:col-span-2"><dt className="type-label text-muted-foreground">Notes</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{registration.notes || "—"}</dd></div>
      </dl>
    </section>
  );
}
