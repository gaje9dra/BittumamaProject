import type { ReactNode } from "react";

type AuthShellProps = {
  label: string;
  title: string;
  description: string;
  context: "user" | "admin";
  children: ReactNode;
};

export function AuthShell({ label, title, description, context, children }: AuthShellProps) {
  const admin = context === "admin";
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[var(--container-wide)] lg:grid-cols-[minmax(0,1.15fr)_minmax(28rem,.85fr)]">
        <section className="relative overflow-hidden border-b border-border px-[var(--page-gutter)] py-10 sm:py-14 lg:border-b-0 lg:border-r lg:px-12 lg:py-16 xl:px-16" aria-label="Bittumama authentication identity">
          <div className="absolute inset-0 pointer-events-none opacity-70" aria-hidden="true">
            <div className="absolute inset-x-0 top-20 border-t border-border/70" />
            <div className="absolute inset-x-0 bottom-20 border-t border-border/70" />
            <div className="absolute left-[18%] top-0 h-full border-l border-border/50" />
            <div className="absolute left-[58%] top-0 h-full border-l border-border/50" />
          </div>
          <div className="relative flex min-h-[15rem] flex-col justify-between sm:min-h-[19rem] lg:min-h-[calc(100vh-8rem)]">
            <div>
              <p className="type-label text-muted-foreground">01 / {admin ? "RESTRICTED ACCESS" : "ACCOUNT ACCESS"}</p>
              <p className="mt-8 max-w-[10ch] type-display text-[clamp(3.5rem,9vw,8rem)]">B.</p>
            </div>
            <div className="max-w-xl">
              <p className="type-label text-muted-foreground">BITTUMAMA</p>
              <p className="mt-3 type-h3 max-w-[16ch]">{admin ? "Administration / controlled entry" : "Research • Education • Services"}</p>
              <div className="mt-8 flex items-end justify-between gap-6 border-t border-border pt-4">
                <span className="type-caption text-muted-foreground">{admin ? "AUTHORIZED ADMINISTRATORS ONLY" : "NORMAL WEBSITE ACCOUNT"}</span>
                <span className="type-caption text-muted-foreground">8.25</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-[var(--page-gutter)] py-12 sm:py-16 lg:px-12 xl:px-16">
          <div className="w-full max-w-xl">
            <div className="border-t border-foreground pt-5">
              <p className="type-label text-muted-foreground">{label}</p>
              <h1 className="type-h1 mt-4 max-w-[12ch]">{title}</h1>
              <p className="type-body-sm mt-4 max-w-[48ch] text-muted-foreground">{description}</p>
            </div>
            <div className="mt-9">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
