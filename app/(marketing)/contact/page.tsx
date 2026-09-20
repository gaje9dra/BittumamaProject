import type { Metadata } from "next";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { ContactIntroduction } from "@/components/contact/contact-introduction";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactServiceContext } from "@/components/contact/contact-service-context";
import { contactData } from "@/data/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: contactData.seo.title,
  description: contactData.seo.description,
});

export default function ContactPage() {

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ContactIntroduction />
      <section aria-labelledby="contact-status-title" className="border-b border-border">
        <div className="mx-auto max-w-[var(--container-wide)] px-[var(--page-gutter)] py-10 sm:py-14">
          <div className="max-w-2xl border-y border-border py-8 sm:py-10">
            <p className="type-label text-muted-foreground">Online enquiry</p>
            <h2 id="contact-status-title" className="type-h3 mt-2 max-w-[24ch]">Online enquiry submission is not available yet.</h2>
            <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
              Review the service catalogue and enquiry guidance below. No enquiry form is presented until a real submission route is connected.
            </p>
          </div>
        </div>
      </section>
      <ContactMethods />
      <ContactGuidance />
      <ContactServiceContext />
    </main>
  );
}
