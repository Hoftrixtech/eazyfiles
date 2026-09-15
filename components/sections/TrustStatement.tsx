import { Container } from "@/components/ui/Container";

export function TrustStatement() {
  return (
    <section className="bg-surface-dark text-surface-dark-foreground">
      <Container className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tools That Just Work.</h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            EazyFiles is built to make everyday file tasks simpler — without complicated software or unnecessary steps.
          </p>
        </div>
      </Container>
    </section>
  );
}
