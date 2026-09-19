import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3";
  id?: string;
  lead: ReactNode;
  accent?: ReactNode;
  align?: "center" | "left";
  size?: "hero" | "section";
  className?: string;
};

export function SplitHeading({
  as = "h2",
  id,
  lead,
  accent,
  align = "center",
  size = "section",
  className,
}: SplitHeadingProps) {
  const Tag = as as ElementType;

  return (
    <Tag
      id={id}
      className={cn(
        "font-semibold tracking-tight",
        size === "hero" ? "hero-heading" : "section-heading",
        accent ? "heading-with-accent mx-auto w-full max-w-5xl" : null,
        accent && align === "center" ? "heading-with-accent--center" : null,
        accent && align === "left" ? "heading-with-accent--left" : null,
        className
      )}
    >
      <span className="heading-with-accent__lead">{lead}</span>
      {accent ? <span className="text-gradient heading-with-accent__accent">{accent}</span> : null}
    </Tag>
  );
}
