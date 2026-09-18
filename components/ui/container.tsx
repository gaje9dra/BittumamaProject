import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "narrow" | "default" | "wide";
};

const sizeClasses = {
  narrow: "max-w-[var(--container-narrow)]",
  default: "max-w-[var(--container-content)]",
  wide: "max-w-[var(--container-wide)]",
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
