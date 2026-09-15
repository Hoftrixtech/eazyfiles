import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <Container className="relative grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20 lg:py-24">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Free online file tools
          </p>
          <h1
            id="home-hero-title"
            className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
          >
            Compress Images Online
            <span className="block text-muted-foreground">Without the Hassle.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Reduce image file size quickly with EazyFiles. Choose your target size, compress your image and download the
            optimized file in seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#compressor"
              className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-6 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-primary/88 sm:w-auto"
            >
              Compress an Image
            </Link>
            <Link
              href="#image-tools"
              className="inline-flex h-12 w-full items-center justify-center rounded-sm border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Explore Image Tools
            </Link>
          </div>
        </div>
        <div className="relative hidden min-h-[280px] md:block" aria-hidden="true">
          <div className="absolute inset-4 rounded-sm border border-border bg-background" />
          <div className="absolute top-10 right-8 h-28 w-28 rounded-sm border border-border bg-muted" />
          <div className="absolute bottom-12 left-10 h-36 w-44 rounded-sm border border-foreground/20 bg-foreground/[0.03]" />
          <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-foreground bg-card shadow-sm" />
        </div>
      </Container>
    </section>
  );
}
