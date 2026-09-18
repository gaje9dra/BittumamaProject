import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NavigationDropdown } from "@/components/layout/navigation-dropdown";
import { NavigationMegaTrigger } from "@/components/layout/navigation-mega-trigger";
import type { NavigationItem } from "@/data/navigation";
import { primaryNavigation } from "@/data/navigation";
import { validateNavigation } from "@/lib/navigation";

const dropdownFixture: NavigationItem = {
  label: "Dropdown fixture",
  href: "/services",
  type: "dropdown",
  description: "Development-only interaction fixture.",
  children: [
    { label: "Services", href: "/services", description: "Primary services destination." },
    { label: "Research & AI", href: "/research", description: "Research and AI destination." },
    { label: "Experts", href: "/experts", description: "Expertise destination." },
  ],
};

const megaFixture: NavigationItem = {
  label: "Mega menu fixture",
  href: "/research",
  type: "mega",
  groups: [
    { label: "Core navigation", items: [
      { label: "Services", href: "/services", description: "Services destination." },
      { label: "Research & AI", href: "/research", description: "Research and AI destination." },
    ]},
    { label: "People & knowledge", items: [
      { label: "Experts", href: "/experts", description: "Experts destination." },
      { label: "Insights", href: "/insights", description: "Insights destination." },
    ]},
  ],
  featured: { label: "About", href: "/about", eyebrow: "Featured destination", description: "Development-only structural fixture." },
};

export default function NavigationPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-lg">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <h1 className="type-h1 mt-3 max-w-[18ch]">Navigation dropdowns & mega-menu foundation</h1>
          <p className="type-body-lg mt-5 max-w-[68ch] text-muted-foreground">These fixtures validate interaction and responsive structure only. They are not production navigation content.</p>
          <div className="mt-12 border-t border-border pt-8">
            <p className="type-label text-muted-foreground">Dropdown</p>
            <div className="mt-4"><NavigationDropdown item={dropdownFixture} pathname="/services" /></div>
          </div>
          <div className="mt-16 border-t border-border pt-8">
            <p className="type-label text-muted-foreground">Mega menu</p>
            <div className="relative mt-4 min-h-80 border border-border bg-background p-5"><NavigationMegaTrigger item={megaFixture} pathname="/research" /></div>
          </div>
          <div className="mt-16 border-t border-border pt-8">
            <p className="type-label text-muted-foreground">Data validation</p>\n            <p className="type-body-sm mt-3 text-muted-foreground">Production navigation issues: {validateNavigation(primaryNavigation).length}</p>
          </div>\n          <div className="mt-16 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            <div><p className="type-label text-muted-foreground">Keyboard</p><p className="type-body-sm mt-3 text-muted-foreground">Enter, Space, or Arrow Down opens. Escape closes and restores trigger focus. Arrow Up/Down/Home/End navigate dropdown links.</p></div>
            <div><p className="type-label text-muted-foreground">Responsive</p><p className="type-body-sm mt-3 text-muted-foreground">Production mobile navigation remains hierarchical and does not inherit desktop mega-menu geometry.</p></div>
          </div>
        </Container>
      </section>
    </main>
  );
}