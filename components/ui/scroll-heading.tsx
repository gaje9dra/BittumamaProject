"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type ScrollDirection = "down" | "up";

type ScrollHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
  headingClassName?: string;
};

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
} as const;

const levelClasses = {
  1: "type-h1",
  2: "type-h2",
  3: "type-h3",
  4: "type-h4",
  5: "type-h5",
} as const;

const subscribers = new Set<(direction: ScrollDirection) => void>();
let scrollDirection: ScrollDirection = "down";
let previousScrollY = 0;
let scrollFrame: number | null = null;
let listening = false;

function notifyScrollDirection() {
  if (typeof window === "undefined" || listening) return;
  listening = true;
  previousScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
}

function subscribeToScrollDirection(subscriber: (direction: ScrollDirection) => void) {
  if (typeof window === "undefined") return () => undefined;

  notifyScrollDirection();
  subscribers.add(subscriber);
  subscriber(scrollDirection);

  return () => {
    subscribers.delete(subscriber);
    if (!subscribers.size) {
      window.removeEventListener("scroll", handleScroll);
      listening = false;
    }
  };
}

let handleScroll = () => undefined;

if (typeof window !== "undefined") {
  handleScroll = () => {
    if (scrollFrame !== null) return;

    scrollFrame = window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== previousScrollY) {
        scrollDirection = currentScrollY > previousScrollY ? "down" : "up";
        previousScrollY = currentScrollY;
        subscribers.forEach((subscriber) => subscriber(scrollDirection));
      }
      scrollFrame = null;
    });
  };
}

export function ScrollHeading({
  children,
  className,
  level = 2,
  as,
  headingClassName,
  ...props
}: ScrollHeadingProps) {
  const Tag = (as ?? headingTags[level]) as ElementType;
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [active, setActive] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToScrollDirection(setDirection), []);

  useEffect(() => {
    const element = windowRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          setDirection(scrollDirection);
          setAnimationKey((key) => key + 1);
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--scroll-heading-distance": "clamp(1.75rem, 12vw, 9rem)",
  } as CSSProperties;

  return (
    <div
      ref={windowRef}
      className={cn(
        "scroll-heading-window",
        direction === "up" ? "scroll-heading-direction-up" : "scroll-heading-direction-down",
        className,
      )}
      style={style}
    >
      <Tag
        key={animationKey}
        className={cn(
          levelClasses[level],
          "scroll-heading-text",
          active && "scroll-heading-text-active",
          direction === "up" ? "scroll-heading-direction-up" : "scroll-heading-direction-down",
          headingClassName,
        )}
        {...props}
      >
        <span aria-hidden="true" className="scroll-heading-ghost">
          {children}
        </span>
        <span className="scroll-heading-main">{children}</span>
      </Tag>
    </div>
  );
}
