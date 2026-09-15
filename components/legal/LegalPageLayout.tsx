import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function LegalPageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main className="border-t border-border">
      <section className="border-b border-border bg-card">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
        </Container>
      </section>
      <section className="section-padding">
        <Container className="max-w-3xl">
          {children ?? (
            <div className="space-y-4 rounded-sm border border-dashed border-border bg-muted/30 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>Legal copy for this page is being prepared for launch.</p>
              <p>Check back soon for the full {title.toLowerCase()} document.</p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
