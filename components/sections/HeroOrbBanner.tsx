import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

export function HeroOrbBanner() {
  return (
    <section
      className="w-full bg-background section-padding !pb-16 !pt-12 sm:!pt-14"
      aria-labelledby="home-hero-title"
    >
      <Container className="flex max-w-[90rem] flex-col items-center text-center">
        <EyebrowPill>Free online image tools</EyebrowPill>

        <SplitHeading
          as="h1"
          id="home-hero-title"
          size="hero"
          className="mt-8 w-full max-w-5xl"
          lead="Free Online Image Tools for Everyday Work"
          accent="Compress, Resize, Crop &amp; Convert."
        />

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Compress, resize, crop, and convert JPG, PNG, and WebP images online with fast, easy-to-use tools. Get the
          right image size and format without installing software.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="#compressor" className={cn(brandCtaClass, "h-12 w-full max-w-xs px-7 sm:w-auto")}>
            Compress an Image
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/tools?category=image-tools"
            className="btn-radius inline-flex h-12 w-full max-w-xs items-center justify-center border border-border bg-card px-7 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            Explore All Tools
          </Link>
        </div>
      </Container>
    </section>
  );
}
