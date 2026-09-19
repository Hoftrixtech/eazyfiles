import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section className="section-padding">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/80 via-card to-muted/40 px-8 py-14 text-center sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(24,93,241,0.08),transparent_55%)]"
            aria-hidden="true"
          />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">Ready to simplify your files?</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">Start with our free image tools.</p>
          <Link
            href="#compressor"
            className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:shadow-[0_12px_40px_rgba(24,93,241,0.25)]"
          >
            Compress an Image
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
