import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { cn } from "@/lib/utils";

const paths = [
  {
    tag: "Account",
    title: "Account & Sign-In Help",
    body:
      "Questions about signing in, your account, or continuing to use EazyFiles after reaching the anonymous compression limit.",
    href: "/login",
    cta: "Sign In →",
  },
  {
    tag: "How it works",
    title: "Learn How EazyFiles Works",
    body:
      "See how uploading, choosing settings, processing, and downloading work across EazyFiles image tools.",
    href: "/how-it-works",
    cta: "How It Works →",
  },
  {
    tag: "Tools",
    title: "Browse Image Tools",
    body:
      "Explore the Image Compressor, Image Resizer, Image Cropper, and Image Converter to find the tool you need.",
    href: "/tools?category=image-tools",
    cta: "Explore Tools →",
  },
  {
    tag: "Privacy",
    title: "Privacy & Data",
    body:
      "Learn how EazyFiles handles uploaded images, account information, and other data before sending a privacy-related request.",
    href: "/privacy",
    cta: "Privacy Policy →",
  },
] as const;

export function ContactOtherPathsSection() {
  return (
    <section className="section-padding bg-muted/35" aria-labelledby="contact-paths-heading">
      <Container className="max-w-[90rem]">
        <header className="max-w-2xl">
          <EyebrowPill className="w-fit">Other ways in</EyebrowPill>
          <h2 id="contact-paths-heading" className="section-heading mt-6 text-foreground">
            Pick the Path That Fits.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Not every question needs a message. Explore these options to find the information you need faster.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {paths.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block btn-radius focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <article
                className={cn(
                  "btn-radius flex h-full flex-col border border-border bg-card p-6 sm:p-8",
                  "transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
                )}
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{item.tag}</p>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <span className="brand-text-link mt-6 w-fit text-sm font-medium transition-opacity group-hover:opacity-90">
                  {item.cta}
                </span>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
