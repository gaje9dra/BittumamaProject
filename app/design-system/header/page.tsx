import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const testCases = [
  ["Top", "Load at the top of the page; header keeps its full treatment."],
  ["Scrolled", "Scroll past the 12px threshold; the header remains visible with restrained separation."],
  ["Desktop", "Test active, hover, focus, search, CTA, and wide-to-small desktop widths."],
  ["Mobile", "Test closed/open, search inside the menu, active route, Escape, focus loop, and touch targets."],
  ["Search", "Open search, confirm input focus, type text, clear it, submit, close with Escape, and verify focus restoration."],
  ["Utility hierarchy", "Search remains compact and secondary while the contact action remains the single primary header action."],
  ["Edge cases", "Try narrow, short, landscape, zoomed, and long-content viewports without horizontal overflow."],
  ["Reduced motion", "Enable prefers-reduced-motion and verify state changes remain clear without decorative movement."],
];

export default function HeaderPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-[180vh] bg-background text-foreground">
      <section className="layout-section-lg">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="type-measure-heading mt-3 font-semibold">
            Header & primary navigation
          </Heading>
          <Text size="lg" className="type-reading mt-5 text-muted-foreground">
            Production header validation surface. Scroll to inspect the top/scrolled states, then resize the
            viewport to test desktop, tablet, mobile, keyboard focus, active navigation, and reduced motion.
          </Text>

          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            {testCases.map(([label, description]) => (
              <div key={label} className="border-b border-border pb-6">
                <p className="type-label text-muted-foreground">{label}</p>
                <Text size="sm" className="mt-3 text-muted-foreground">
                  {description}
                </Text>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="type-label text-muted-foreground">Utility layer reference</p>
            <Heading level={2} className="type-h3 mt-3 max-w-[32ch]">
              Search supports discovery without competing with the primary navigation.
            </Heading>
            <Text size="default" className="type-reading mt-5 text-muted-foreground">
              Desktop exposes a compact Search action beside the existing contact CTA. Mobile keeps one search
              interface inside the navigation surface, avoiding competing overlays. Search submission navigates
              to the frontend-only /search?q= route foundation; no production search data is connected.
            </Text>
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="type-label text-muted-foreground">Long-content / anchor test</p>
            <Heading level={2} className="type-h3 mt-3 max-w-[32ch]">
              The header remains available without hijacking the document scroll.
            </Heading>
            <Text size="default" className="type-reading mt-5 text-muted-foreground">
              This deliberately long development surface provides enough page height to verify sticky
              positioning, scroll-state transitions, keyboard focus, and body-scroll restoration after the
              mobile menu closes. Future in-page sections can opt into the scroll-anchor primitive when they
              use hash navigation.
            </Text>
            <div className="mt-16 h-[60vh] border-l border-border pl-6">
              <p className="type-label text-muted-foreground">Scroll depth</p>
              <Text size="sm" className="mt-3 text-muted-foreground">
                Continue scrolling, resize between mobile and desktop, and return to the top to confirm the
                header state returns cleanly.
              </Text>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
