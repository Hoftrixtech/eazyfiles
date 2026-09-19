import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { cn } from "@/lib/utils";

const paths = [
  {
    tag: "Account",
    title: "Account & sign-in help",
    body: "Questions about logging in, your dashboard, or continuing after the free compression limit.",
    href: "/login",
    cta: "Sign in →",
  },
  {
    tag: "How it works",
    title: "Learn the workflow",
    body: "See how upload, settings, and download work across EazyFiles image tools before you write in.",
    href: "/how-it-works",
    cta: "How it works →",
  },
  {
    tag: "Tools",
    title: "Browse image tools",
    body: "Jump straight to the compressor, resizer, cropper, or converter if you already know what you need.",
    href: "/tools?category=image-tools",
    cta: "Explore tools →",
  },
  {
    tag: "Privacy",
    title: "Privacy & data",
    body: "Read how uploaded files and account information are handled before sending a privacy-related request.",
    href: "/privacy",
    cta: "Privacy policy →",
  },
] as const;

export function ContactOtherPathsSection() {
  return (
    <section className="section-padding bg-muted/35" aria-labelledby="contact-paths-heading">
      <Container className="max-w-[90rem]">
        <header className="max-w-2xl">
          <EyebrowPill className="w-fit">Other ways in</EyebrowPill>
          <h2 id="contact-paths-heading" className="section-heading mt-6 text-foreground">
            Pick the path that fits.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Not everything needs a form. These pages may answer your question faster.
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
