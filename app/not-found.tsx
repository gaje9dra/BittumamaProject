import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen px-[var(--page-gutter)] py-16">
      <div className="mx-auto w-full max-w-[var(--container-content)]">
        <h1 className="text-[length:var(--font-size-h1)] font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-[length:var(--font-size-body)] text-[var(--muted)]">
          The page you requested could not be found.
        </p>
      </div>
      </main>
      <Footer />
    </>
  );
}
