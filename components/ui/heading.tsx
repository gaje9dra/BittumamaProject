import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5;
  /** Optional semantic tag override for existing consumers. */
  as?: HeadingTag;
};

const levelClasses = {
  1: "type-h1",
  2: "type-h2",
  3: "type-h3",
  4: "type-h4",
  5: "type-h5",
} as const;

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
} as const;

export function Heading({
  children,
  className,
  level = 2,
  as,
  ...props
}: HeadingProps) {
  const Tag = as ?? headingTags[level];

  return (
    <Tag className={cn(levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}
