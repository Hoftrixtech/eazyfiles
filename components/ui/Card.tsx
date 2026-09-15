import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border bg-card text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    />
  );
}
