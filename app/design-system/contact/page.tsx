import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { ContactIntroduction } from "@/components/contact/contact-introduction";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactServiceContext } from "@/components/contact/contact-service-context";

export default function ContactDesignPreview() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-accent bg-surface-muted">
        <div className="mx-auto max-w-[var(--container-standard)] px-[var(--page-gutter)] py-3">
          <p className="type-label text-accent-foreground">Development reference</p>
          <p className="type-caption mt-1 text-muted-foreground">
            Form state preview. No data is sent or stored.
          </p>
        </div>
      </div>
      <ContactIntroduction />
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[var(--container-wide)] gap-10 px-[var(--page-gutter)] py-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4"><p className="type-label text-primary">Form states</p><h2 className="type-h3 mt-2">Enquiry foundation</h2></div>
          <div className="lg:col-span-8"><ContactForm /></div>
        </div>
      </section>
      <ContactMethods />
      <ContactGuidance />
      <ContactServiceContext />
    </main>
  );
}
