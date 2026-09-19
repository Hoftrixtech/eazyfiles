import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function EyebrowPill({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "onDark";
}) {
  return (
    <p className={cn("eyebrow-pill", variant === "onDark" && "eyebrow-pill--on-dark", className)}>
      <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      {children}
    </p>
  );
}
