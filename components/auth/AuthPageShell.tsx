import type { ReactNode } from "react";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function AuthPageShell({
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  children,
}: {
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main>
      <PageHeroBanner
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: breadcrumbLabel },
        ]}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <Container className="section-padding">
        <div className="mx-auto w-full max-w-md">
          <Card className="border border-border p-6 shadow-[var(--shadow-elevated)] sm:p-8">{children}</Card>
        </div>
      </Container>
    </main>
  );
}
