import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getInquiryById } from "@/lib/admin/inquiries";
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Inquiry | Bittumama", robots: { index: false, follow: false, nocache: true, noarchive: true } };

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" }).format(value);
}

const labels = { NEW: "New", READ: "Read", IN_PROGRESS: "In progress", RESOLVED: "Resolved", SPAM: "Spam" };

export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  return (
    <section aria-labelledby="inquiry-title" className="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6">
        <div>
          <Link href="/admin/inquiries" className="text-sm underline underline-offset-4">← All inquiries</Link>
          <p className="type-label mt-5 text-muted-foreground">Inquiry</p>
          <h1 id="inquiry-title" className="type-h2 mt-2">{inquiry.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Submitted {formatDate(inquiry.submittedAt)}</p>
        </div>
        <InquiryStatusForm id={inquiry.id} status={inquiry.status} />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="contact-details-title">
            <h2 id="contact-details-title" className="type-h5">Contact details</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt><dd className="mt-1 text-sm">{inquiry.name}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt><dd className="mt-1 text-sm break-words"><a href={`mailto:${inquiry.email}`} className="underline underline-offset-4">{inquiry.email}</a></dd></div>
              {inquiry.phone && <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</dt><dd className="mt-1 text-sm"><a href={`tel:${inquiry.phone.replace(/[^+\d]/g, "")}`} className="underline underline-offset-4">{inquiry.phone}</a></dd></div>}
              <div><dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</dt><dd className="mt-1 text-sm">{labels[inquiry.status]}</dd></div>
            </dl>
          </section>

          <section aria-labelledby="requirement-title">
            <h2 id="requirement-title" className="type-h5">Requirement</h2>
            <p className="mt-3 text-sm">{inquiry.service ? <Link href={`/admin/content/services/${inquiry.service.id}/edit`} className="underline underline-offset-4">{inquiry.service.title}</Link> : "No service selected"}</p>
            {inquiry.service && inquiry.service.status !== "PUBLISHED" && <p className="mt-2 text-xs text-muted-foreground">This service is currently {inquiry.service.status.toLowerCase()}.</p>}
          </section>

          <section aria-labelledby="message-title">
            <h2 id="message-title" className="type-h5">Message</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">{inquiry.message}</p>
          </section>
        </div>

        <aside className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6">
          <h2 className="type-h5">Record</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div><dt className="text-xs text-muted-foreground">Submitted</dt><dd className="mt-1">{formatDate(inquiry.submittedAt)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Created</dt><dd className="mt-1">{formatDate(inquiry.createdAt)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Last updated</dt><dd className="mt-1">{formatDate(inquiry.updatedAt)}</dd></div>
            {inquiry.user && <div><dt className="text-xs text-muted-foreground">Authenticated user</dt><dd className="mt-1 break-words">{inquiry.user.name || inquiry.user.email || inquiry.user.id}</dd></div>}
          </dl>
        </aside>
      </div>
    </section>
  );
}
