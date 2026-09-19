import type { ReactNode } from "react";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { Container } from "@/components/ui/Container";

export function LegalPageLayout({
  title,
  intro,
  eyebrow = "Legal",
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <main>
      <PageHeroBanner
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: title },
        ]}
        eyebrow={eyebrow}
        title={title}
        description={intro}
      />
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
