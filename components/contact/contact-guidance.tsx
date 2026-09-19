import { Container } from "@/components/ui/container";
import { contactData } from "@/data/contact";

export function ContactGuidance() {
  return (
    <section className="border-b border-border">
      <Container width="standard" className="py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="type-label text-primary">What to include</p>
            <h2 className="type-h3 mt-2 max-w-[20ch]">Give us the context.</h2>
          </div>
          <ul className="divide-y divide-border border-y border-border lg:col-span-8">
            {contactData.enquiryGuidance.map((item) => (
              <li key={item} className="type-body-sm py-4">{item}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
