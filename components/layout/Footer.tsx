import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const FOOTER_DESCRIPTION =
  "Simple online tools for images and common file tasks. Process your files, choose the options you need, and download your results.";

const toolLinks = [
  { href: "/tools/image-compressor", label: "Image Compressor" },
  { href: "/tools/image-resizer", label: "Image Resizer" },
  { href: "/tools/image-cropper", label: "Image Cropper" },
  { href: "/tools/image-converter", label: "Image Converter" },
  { href: "/tools/image-to-pdf", label: "Image to PDF" },
] as const;

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

function FooterNavColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold tracking-wide text-foreground uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/50">
      <Container className="section-padding !py-14">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-sm text-sm font-medium tracking-tight text-foreground">{APP_TAGLINE}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{FOOTER_DESCRIPTION}</p>
          </div>

          <FooterNavColumn title="Tools">
            {toolLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterNavColumn>

          <FooterNavColumn title="Company">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterNavColumn>

          <FooterNavColumn title="Legal">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm text-muted-foreground transition-colors hover:text-foreground",
                    "underline-offset-4 hover:underline"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterNavColumn>
        </div>

        <p className="mt-14 border-t border-border/60 pt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
