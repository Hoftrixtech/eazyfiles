import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="page-hero-banner section-padding border-t border-[var(--section-divider)]" aria-labelledby="final-cta-title">
      <Container className="max-w-[90rem] text-center">
        <h2
          id="final-cta-title"
          className="hero-heading heading-with-accent heading-with-accent--center mx-auto text-white"
        >
          <span className="heading-with-accent__lead text-white">Ready to Compress Your Images</span>
          <span className="heading-with-accent__accent text-white">Online?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          Use EazyFiles to compress JPG, PNG, and WebP images online and reduce their file size with a target size
          that fits your needs.
        </p>
        <Link
          href="/#compressor"
          className={cn(
            brandCtaClass,
            "mt-8 h-12 px-8 hover:shadow-[0_12px_40px_rgba(24,93,241,0.35)]"
          )}
        >
          Compress an Image →
        </Link>
      </Container>
    </section>
  );
}
