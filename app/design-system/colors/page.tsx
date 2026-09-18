import { notFound } from "next/navigation";

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
