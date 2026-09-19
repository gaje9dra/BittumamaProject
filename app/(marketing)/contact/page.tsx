import type { Metadata } from "next";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { ContactIntroduction } from "@/components/contact/contact-introduction";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactServiceContext } from "@/components/contact/contact-service-context";
import { contactData } from "@/data/contact";

export const metadata: Metadata = {
  title: contactData.seo.title,
  description: contactData.seo.description,
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ContactIntroduction />
      <section aria-labelledby="contact-form-title" className="border-b border-border">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 px-[var(--page-gutter)] py-10 sm:py-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-primary">Start your enquiry</p>
            <h2 id="contact-form-title" className="type-h3 mt-2 max-w-[20ch]">What do you need help with?</h2>
            <p className="type-body-sm mt-4 max-w-[38ch] text-muted-foreground">
              Select the requirement context, then give us enough detail to understand the work.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ContactForm initialService={service} />
          </div>
        </div>
      </section>
      <ContactMethods />
      <ContactGuidance />
      <ContactServiceContext />
    </main>
  );
}
