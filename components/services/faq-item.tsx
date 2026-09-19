"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((current) => !current)}
        className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
      >
        <span className="type-body font-medium">{question}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--motion-standard)]",
            open && "rotate-180",
          )}
        />
      </button>

      <div id={answerId} hidden={!open} className="pb-5">
        <p className="type-body-sm max-w-[58ch] text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}
