import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "narrow" | "reading" | "default" | "wide" | "full";
};

const sizeClasses = {
  narrow: "max-w-[var(--container-narrow)]",
  reading: "max-w-[var(--container-reading)]",
  default: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
  full: "max-w-none",
} as const;

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--page-gutter)]",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
