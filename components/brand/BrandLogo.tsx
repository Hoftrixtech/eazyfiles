import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/brand/eazyfiles-logo.svg";

export function BrandLogo({
  href = "/",
  size = "md",
  className,
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const height = size === "sm" ? "h-7" : size === "lg" ? "h-10" : "h-8";
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
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
    <Link href={href} className="inline-flex items-center rounded-sm" aria-label="EazyFiles home">
      {image}
    </Link>
  );
}
