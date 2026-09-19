"use client";

import { useState } from "react";

type PreviewState = "default" | "focused" | "invalid" | "disabled" | "submitting" | "success" | "failure";

const states: PreviewState[] = ["default", "focused", "invalid", "disabled", "submitting", "success", "failure"];

export function ContactFormStatePreview() {
  const [state, setState] = useState<PreviewState>("default");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[var(--container-wide)] px-[var(--page-gutter)] py-10">
        <div className="flex flex-wrap gap-2 border-b border-border pb-5">
          {states.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={state === item}
              onClick={() => setState(item)}
              className="min-h-10 rounded-[var(--radius-md)] border border-border px-3 type-caption capitalize hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-7 max-w-2xl border-y border-border p-5 sm:p-7">
          <p className="type-label text-primary">Preview state</p>
          <h2 className="type-h3 mt-2 capitalize">{state}</h2>

          {state === "default" && <p className="type-body-sm mt-3 text-muted-foreground">The form is ready for an enquiry.</p>}
          {state === "focused" && <p className="type-body-sm mt-3 text-muted-foreground">A field has visible keyboard focus using the production focus treatment.</p>}
          {state === "invalid" && <p role="alert" className="type-caption mt-3 text-error">Enter a valid email address and tell us about your requirement.</p>}
          {state === "disabled" && <button disabled className="mt-5 min-h-11 rounded-[var(--radius-md)] bg-surface-muted px-5 type-button text-muted-foreground">Send Enquiry</button>}
          {state === "submitting" && <button disabled className="mt-5 min-h-11 rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground">Preparing…</button>}
          {state === "success" && <p role="status" className="mt-3 type-body-sm text-muted-foreground">Success-state UI reserved for a future real submission mechanism. No enquiry has been submitted.</p>}
          {state === "failure" && <p role="alert" className="mt-3 type-body-sm text-error">No submission service is connected yet. The production form does not claim that an enquiry was received.</p>}
        </div>
      </div>
    </section>
  );
}
