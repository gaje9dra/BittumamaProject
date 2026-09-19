import { Container } from "@/components/ui/container";
import { contactData } from "@/data/contact";

export function ContactMethods() {
  if (!contactData.contactMethods.length) return null;

  return (
    <section className="border-b border-border">
      <Container width="standard" className="py-12">
        <p className="type-label text-primary">Direct contact</p>
        <h2 className="type-h3 mt-2">Choose a contact method.</h2>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {contactData.contactMethods.map((method) => (
            <a key={method.label} href={method.href} className="flex min-h-14 items-center justify-between gap-5 py-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              <span><span className="type-label block text-muted-foreground">{method.label}</span><span className="type-body-sm mt-1 block">{method.action}</span></span>
              <span className="type-button">Open</span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
