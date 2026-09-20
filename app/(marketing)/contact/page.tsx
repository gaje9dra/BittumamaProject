import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { ContactIntroduction } from "@/components/contact/contact-introduction";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactServiceContext } from "@/components/contact/contact-service-context";
import { contactData } from "@/data/contact";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedServices } from "@/lib/services/repository";

export const metadata: Metadata = createPageMetadata({
  title: contactData.seo.title,
  description: contactData.seo.description,
});

export default async function ContactPage() {
  const services = await getPublishedServices();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ContactIntroduction />
      <section aria-labelledby="contact-status-title" className="border-b border-border">
        <div className="mx-auto max-w-[var(--container-wide)] px-[var(--page-gutter)] py-10 sm:py-14">
          <div className="max-w-2xl">
            <p className="type-label text-muted-foreground">Online enquiry</p>
            <h2 id="contact-status-title" className="type-h3 mt-2 max-w-[24ch]">Tell us what you need help with.</h2>
            <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
              Share the requirement and the relevant service context. Your enquiry is submitted securely for follow-up.
            </p>
          </div>
          <div className="mt-7 max-w-2xl">
            <ContactForm services={services} />
          </div>
        </div>
      </section>
      <ContactMethods />
      <ContactGuidance />
      <ContactServiceContext />
    </main>
  );
}
