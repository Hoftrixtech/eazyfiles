import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/seo";

const LEGAL_DESCRIPTIONS: Record<string, string> = {
  About: "Learn about EazyFiles and our mission to provide simple online image tools.",
  Contact:
    "Questions about EazyFiles, our image tools, or your account? Send us a message below. We read submissions as we expand support channels for launch.",
  "Privacy Policy": "How EazyFiles handles information when you use our website and image tools.",
  Terms: "Terms that govern your use of the EazyFiles website and online tools.",
  Disclaimer: "Important limitations and responsibilities when using EazyFiles online utility tools.",
};

export function legalPageMetadata(title: string, path: string): Metadata {
  return createPageMetadata({
    title: `${title} | EazyFiles`,
    description: LEGAL_DESCRIPTIONS[title] ?? `${title} for EazyFiles.`,
    path,
    absoluteTitle: true,
  });
}

export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <main className="py-12 sm:py-16">
      <Container className="max-w-2xl">
        <h1 className="page-heading">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This page is reserved for launch and does not contain legal or company copy yet.
        </p>
      </Container>
    </main>
  );
}
