import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  size?: "lg" | "default" | "sm" | "caption";
};

const sizeClasses = {
  lg: "type-body-lg",
  default: "type-body",
  sm: "type-body-sm",
  caption: "type-caption",
} as const;

export function Text({
  children,
  className,
  as = "p",
  size = "default",
  ...props
}: TextProps) {
  const Tag = as;

  return (
    <Tag className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </Tag>
  );
}
