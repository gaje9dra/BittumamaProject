import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactGuidance } from "@/components/contact/contact-guidance";
import { Container } from "@/components/ui/container";
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
    <main className="bg-background text-foreground">
      <section className="border-b border-border">
        <Container size="wide" className="py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="type-label text-primary">Contact / Enquiry</p>
            <h1 className="type-h1 mt-3 max-w-[18ch]">
              Tell us what you’re working on.
            </h1>
            <p className="type-body mt-4 max-w-[58ch] text-muted-foreground">
              Share the requirement, context and the kind of support you’re looking for.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-form-title">
        <Container
          size="wide"
          className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12 lg:py-14 xl:gap-16"
        >
          <div className="lg:pt-2">
            <p className="type-label text-primary">Your requirement</p>
            <h2 id="contact-form-title" className="type-h3 mt-3 max-w-[18ch]">
              Give us the context we need.
            </h2>
            <p className="type-body-sm mt-4 max-w-[42ch] text-muted-foreground">
              A clear requirement helps the enquiry reach the right service context.
            </p>

            <div className="mt-8 border-t border-border pt-6">
              <ContactGuidance />
            </div>
          </div>

          <div className="min-w-0">
            <div className="border border-border bg-surface p-4 sm:p-6 lg:p-7">
              <p className="type-label text-muted-foreground">Start your enquiry</p>
              <div className="mt-5">
                <ContactForm services={services} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
