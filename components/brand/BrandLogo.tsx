import Link from "next/link";
import { cn } from "@/lib/utils";

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
    // Wordmark SVG; height-only sizing keeps the original aspect ratio.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/eazyfiles-logo.svg"
      alt="EazyFiles"
      width={196}
      height={40}
      className={cn(height, "w-auto max-w-[min(100%,11rem)]", className)}
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
