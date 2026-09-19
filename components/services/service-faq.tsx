import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { FaqItem } from "@/components/services/faq-item";
import type { Service } from "@/data/services";

type ServiceFaqProps = {
  service: Service;
};

export function ServiceFAQ({ service }: ServiceFaqProps) {
  if (!service.faq?.length) return null;

  return (
    <section aria-labelledby="service-faq-title" className="bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Common questions</p>
            <Heading id="service-faq-title" level={2} className="mt-4 max-w-[18ch]">
              Questions about this service.
            </Heading>
          </div>

          <div className="border-t border-border lg:col-span-8 lg:col-start-5">
            {service.faq.map((item, index) => (
              <FaqItem
                key={`${service.slug}-faq-${index}`}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
