import type { HTMLAttributes } from "react";
import { SITE_CONTENT_MAX_WIDTH_CLASS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", SITE_CONTENT_MAX_WIDTH_CLASS, className)}
      {...props}
    />
  );
}
