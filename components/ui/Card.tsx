import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card/90 text-card-foreground shadow-[var(--shadow-elevated)] ring-1 ring-white/[0.04]",
        className
      )}
      {...props}
    />
  );
}
