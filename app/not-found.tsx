import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found | EazyFiles",
  description: "The page you requested could not be found on EazyFiles.",
  path: "/",
  noIndex: true,
  absoluteTitle: true,
  canonical: false,
});

export default function NotFound() {
  return (
    <main className="border-t border-border py-20 sm:py-28">
      <Container className="max-w-lg text-center">
        <p className="text-7xl font-semibold tracking-tighter sm:text-8xl">404</p>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Looks like this file went missing.</h1>
        <p className="mt-3 text-muted-foreground">The page may have moved or the link might be incorrect.</p>
        <Link
          href="/"
          className="btn-radius brand-gradient-bg mt-10 inline-flex h-12 items-center justify-center px-8 text-sm font-medium text-primary-foreground shadow-sm transition-[filter] hover:brightness-[1.06]"
        >
          Back to EazyFiles
        </Link>
      </Container>
    </main>
  );
}
