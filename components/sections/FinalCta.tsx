import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section className="section-padding border-t border-border bg-muted/50">
      <Container className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to simplify your files?</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Start with our free image tools.</p>
        <Link
          href="#compressor"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/88"
        >
          Compress an Image
        </Link>
      </Container>
    </section>
  );
}
