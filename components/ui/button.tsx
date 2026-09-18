import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "text";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-700 active:bg-primary-800",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-700 active:bg-secondary-800",
  outline: "border border-border bg-transparent text-foreground hover:bg-surface-muted active:bg-surface-interactive",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted active:bg-surface-interactive",
  text: "bg-transparent px-0 text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary active:text-primary-800",
} as const;

const sizeClasses = {
  sm: "min-h-9 px-3",
  md: "min-h-10 px-4",
  lg: "min-h-11 px-5",
} as const;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] type-button transition-[background-color,color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-border",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ className?: string }>, {
      className: cn(classes, children.props.className),
    });
  }

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
