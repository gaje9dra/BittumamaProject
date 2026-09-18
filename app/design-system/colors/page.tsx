import Link from "next/link";
import { notFound } from "next/navigation";

const typography = [
  ["Display", ".type-display", "Literata", "700", "clamp(3.25rem, 7vw, 6.5rem)", "1.02", "-0.035em"],
  ["H1", ".type-h1", "Literata", "600", "clamp(2.5rem, 5.2vw, 4.75rem)", "1.12", "-0.022em"],
  ["H2", ".type-h2", "Literata", "600", "clamp(2rem, 3.8vw, 3.25rem)", "1.12", "-0.022em"],
  ["H3", ".type-h3", "Literata", "600", "clamp(1.5rem, 2.5vw, 2.25rem)", "1.12", "-0.022em"],
  ["H4", ".type-h4", "Literata", "600", "clamp(1.25rem, 1.8vw, 1.5rem)", "1.12", "-0.022em"],
  ["H5", ".type-h5", "Literata", "600", "1.125rem", "1.12", "-0.022em"],
  ["Body Large", ".type-body-lg", "IBM Plex Sans", "400", "1.125rem", "1.65", "0em"],
  ["Body", ".type-body", "IBM Plex Sans", "400", "1rem", "1.6", "0em"],
  ["Body Small", ".type-body-sm", "IBM Plex Sans", "400", "0.875rem", "1.5", "0em"],
  ["Caption", ".type-caption", "IBM Plex Sans", "400", "0.75rem", "1.4", "0em"],
  ["Label", ".type-label", "IBM Plex Sans", "600", "0.8125rem", "1.35", "0.075em"],
  ["Navigation", ".type-nav", "IBM Plex Sans", "500", "0.9375rem", "1.4", "0.005em"],
  ["Button", ".type-button", "IBM Plex Sans", "500", "0.9375rem", "1.25", "0em"],
];

const colors = [
  ["Background", "--background", "#F7F6F2", "Default page canvas"],
  ["Foreground", "--foreground", "#17211F", "Primary text and headings"],
  ["Surface", "--surface", "#FFFFFF", "Elevated reading surface"],
  ["Muted surface", "--surface-muted", "#EFEEE9", "Section separation"],
  ["Interactive surface", "--surface-interactive", "#E8E9E3", "Neutral interactive state"],
  ["Highlight", "--surface-highlight", "#E9F0EB", "Contextual research emphasis"],
  ["Primary", "--primary", "#173F3A", "Primary actions and brand emphasis"],
  ["Secondary", "--secondary", "#6B6255", "Supporting actions and editorial detail"],
  ["Accent", "--accent", "#A34F3F", "Scarce emphasis and key calls to action"],
  ["Border", "--border", "#D7D7CF", "Structural boundaries"],
  ["Muted text", "--muted-foreground", "#5C6561", "Secondary text and metadata"],
  ["Success", "--success", "#2F6B4F", "Confirmed/positive state"],
  ["Warning", "--warning", "#9A6A20", "Attention/pending state"],
  ["Error", "--error", "#A33F3F", "Validation/failed state"],
  ["Info", "--info", "#386779", "Informational state"],
];

export default function ColorSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background px-[var(--page-gutter)] py-12 text-foreground">
      <div className="mx-auto w-full max-w-[var(--container-wide)]">
        <header className="mb-10 max-w-2xl">
          <p className="type-body-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Development reference
          </p>
          <h1 className="type-h1 mt-3 font-semibold">Color system</h1>
          <p className="type-body-lg mt-4 text-muted-foreground">
            Production semantic tokens for the research/editorial visual language.
          </p>
        </header>

        <section aria-labelledby="semantic-colors" className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          <h2 id="semantic-colors" className="sr-only">Semantic colors</h2>
          {colors.map(([name, token, value, usage]) => (
            <article key={token} className="bg-surface p-5">
              <div
                className="mb-5 h-24 border border-border"
                style={{ backgroundColor: value }}
                aria-label={name}
              />
              <h3 className="type-h4 font-semibold">{name}</h3>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{token}</p>
              <p className="mt-2 font-mono text-sm">{value}</p>
              <p className="type-body-sm mt-3 text-muted-foreground">{usage}</p>
            </article>
          ))}
        </section>

        <section className="mt-10" aria-labelledby="typography-preview">
          <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="typography-preview" className="type-h3 font-semibold">Typography preview</h2>
              <p className="type-body-sm mt-2 max-w-2xl text-muted-foreground">
                Editorial display uses Literata; body and interface text use IBM Plex Sans.
              </p>
            </div>
            <Link href="/design-system/colors" className="type-body-sm text-primary underline underline-offset-4">
              Color tokens
            </Link>
          </div>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {typography.map(([name, token, family, weight, size, leading, tracking]) => (
              <article key={name} className="grid gap-4 py-6 lg:grid-cols-[10rem_1fr_20rem] lg:items-center">
                <div>
                  <p className="type-body-sm font-semibold">{name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{token}</p>
                </div>
                <div className={token.replace(".", "")}>
                  {name === "Display" ? "Research, interpreted." : name === "Large Numbers" ? "42.8" : "Clarity with character, built for research and real people."}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground sm:grid-cols-4 lg:grid-cols-2">
                  <div><dt className="sr-only">Typeface</dt><dd>{family}</dd></div>
                  <div><dt className="sr-only">Weight</dt><dd>Weight {weight}</dd></div>
                  <div><dt className="sr-only">Size</dt><dd>{size}</dd></div>
                  <div><dt className="sr-only">Line height and tracking</dt><dd>{leading} / {tracking}</dd></div>
                </dl>
              </article>
            ))}
            <article className="grid gap-4 py-6 lg:grid-cols-[10rem_1fr_20rem] lg:items-center">
              <div><p className="type-body-sm font-semibold">Large Numbers</p><p className="mt-1 font-mono text-xs text-muted-foreground">--text-display-metric</p></div>
              <div className="font-display text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">42.8</div>
              <p className="type-body-sm text-muted-foreground">Example metric with contextual label and source in production.</p>
            </article>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="type-h3 font-semibold">Surface hierarchy</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              ["Page", "bg-background"],
              ["Section", "bg-surface-muted"],
              ["Elevated", "bg-surface"],
              ["Interactive", "bg-surface-interactive"],
              ["Highlight", "bg-surface-highlight"],
            ].map(([label, utility]) => (
              <div key={utility} className="border border-border bg-surface p-4">
                <div className={`h-20 ${utility} border border-border`} />
                <p className="mt-3 type-body-sm font-medium">{label}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{utility}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 bg-[var(--dark-background)] p-6 text-[var(--dark-foreground)]">
          <h2 className="type-h3 font-semibold">Dark editorial surface</h2>
          <p className="type-body-sm mt-2 text-[var(--dark-muted-foreground)]">
            Reserved for intentional high-contrast research or editorial sections.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Dark background", "#17211F"],
              ["Dark surface", "#22302C"],
              ["Dark muted", "#2A3733"],
              ["Dark border", "#43514C"],
            ].map(([label, value]) => (
              <div key={label} className="border border-[var(--dark-border)] bg-[var(--dark-surface)] p-4">
                <div className="h-14 border border-[var(--dark-border)]" style={{ backgroundColor: value }} />
                <p className="mt-2 type-body-sm">{label}</p>
                <p className="font-mono text-xs text-[var(--dark-muted-foreground)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="type-h3 font-semibold">Data palette</h2>
          <div className="mt-5 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {["#173F3A", "#386779", "#7B5B8A", "#A34F3F", "#9A6A20", "#58724F"].map((value, index) => (
              <div key={value} className="bg-surface p-4">
                <div className="h-16" style={{ backgroundColor: value }} />
                <p className="mt-2 font-mono text-xs">{index + 1}: {value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
