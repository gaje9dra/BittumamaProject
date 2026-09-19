import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { services } from "@/data/services";

export default function ServicesPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const previewServices = [
    ...services,
    {
      ...services[0],
      id: "preview-long-title",
      title: "Thesis Support for Extended Research Projects",
    },
    {
      ...services[3],
      id: "preview-short-title",
      title: "Analysis",
      audience: undefined,
    },
    {
      ...services[1],
      id: "preview-long-description",
      shortDescription:
        "Dissertation assistance, editing and research support across a longer academic requirement.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">
            Services Discovery
          </Heading>
          <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
            Responsive preview for the service directory, category grouping,
            long content and optional metadata.
          </p>
        </Container>
      </section>

      <section className="bg-surface-muted">
        <Container size="wide" className="layout-section-lg">
          <div className="border-t border-border">
            {previewServices.map((service, index) => (
              <div
                key={service.id}
                className="grid gap-5 border-b border-border py-7 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(11rem,.45fr)_auto] sm:items-start sm:gap-6"
              >
                <span className="type-caption text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <Heading level={3} className="max-w-[24ch]">
                    {service.title}
                  </Heading>
                  <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="sm:border-l sm:border-border sm:pl-6">
                  <p className="type-caption text-muted-foreground">For</p>
                  <p className="type-body-sm mt-1">
                    {service.audience ?? "—"}
                  </p>
                </div>

                <span className="type-caption text-muted-foreground">
                  {service.category}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
