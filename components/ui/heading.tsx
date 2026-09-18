import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
};

const levelClasses = {
  1: "type-h1",
  2: "type-h2",
  3: "type-h3",
  4: "type-h4",
} as const;

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

export function Heading({
  children,
  className,
  level = 2,
  ...props
}: HeadingProps) {
  const Tag = headingTags[level];

  return (
    <Tag className={cn(levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}
