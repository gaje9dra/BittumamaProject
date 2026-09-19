import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "narrow" | "reading" | "default" | "wide" | "full" | "standard";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize;
  /** Backward-compatible alias for size. */
  width?: ContainerSize;
};

const sizeClasses = {
  narrow: "max-w-[var(--container-narrow)]",
  reading: "max-w-[var(--container-reading)]",
  default: "max-w-[var(--container-content)]",
  standard: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
  full: "max-w-none",
} as const;

export function Container({
  children,
  className,
  size,
  width,
  ...props
}: ContainerProps) {
  const resolvedSize = size ?? width ?? "default";

  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--page-gutter)]",
        sizeClasses[resolvedSize],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
