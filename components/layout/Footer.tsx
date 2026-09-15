import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const columns = [
  {
    title: "Tools",
    links: [
      { href: "/tools/image-compressor", label: "Image Compressor" },
      { href: "/tools/image-resizer", label: "Image Resizer" },
      { href: "/tools/image-cropper", label: "Image Cropper" },
      { href: "/tools/image-converter", label: "Image Converter" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card/50">
      <Container className="section-padding !py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-xs text-sm font-medium tracking-tight text-foreground">{APP_TAGLINE}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Simple online image tools. Files are processed temporarily and are not stored.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-semibold tracking-wide text-foreground uppercase">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-14 pt-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </Container>
    </footer>
  );
}
