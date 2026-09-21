import type { MouseEventHandler } from "react";
import Link from "next/link";
import { BRAND_LOGO_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandLogo({
  href = "/",
  size = "md",
  className,
  onClick,
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const height = size === "sm" ? "h-7" : size === "lg" ? "h-10" : "h-8";
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND_LOGO_PATH}
      alt="EazyFiles"
      width={280}
      height={63}
      className={cn(height, "w-auto max-w-[min(100%,17rem)]", className)}
      decoding="async"
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-sm"
      aria-label="EazyFiles home"
      onClick={onClick}
    >
      {image}
    </Link>
  );
}
