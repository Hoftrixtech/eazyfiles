import { Container } from "@/components/ui/Container";

export function TrustStatement() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <Container className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools That Just <span className="text-gradient">Work.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            EazyFiles is built to make everyday file tasks simpler — without complicated software or unnecessary steps.
          </p>
        </div>
      </Container>
    </section>
  );
}
