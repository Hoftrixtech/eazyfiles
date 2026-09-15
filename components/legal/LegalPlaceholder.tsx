import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/seo";

const LEGAL_DESCRIPTIONS: Record<string, string> = {
  About: "Learn about EazyFiles and our mission to provide simple online image tools.",
  Contact: "Contact EazyFiles for support and general inquiries about our online image tools.",
  "Privacy Policy": "Read how EazyFiles handles data and privacy when you use our online image tools.",
  Terms: "Terms of use for EazyFiles online image tools and website.",
  Disclaimer: "Disclaimer for EazyFiles online image tools and website content.",
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
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This page is reserved for launch and does not contain legal or company copy yet.
        </p>
      </Container>
    </main>
  );
}
