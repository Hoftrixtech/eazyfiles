import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

const breadcrumbOnDarkClass =
  "text-white/55 [&_a]:transition-colors [&_a]:hover:text-white [&_span.text-foreground]:text-white";

export function PageHeroBanner({
  id = "page-hero-title",
  breadcrumb,
  eyebrow,
  title,
  titleLine2,
  tagline,
  description,
  cta,
  titleClassName,
  children,
}: {
  id?: string;
  breadcrumb: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  titleLine2?: string;
  tagline?: string;
  description?: string;
  cta?: { href: string; label: string };
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero-banner" aria-labelledby={id}>
      <Container className="max-w-[90rem] py-16 sm:py-20 lg:py-24">
        <div className="page-hero-banner__inner">
          <Breadcrumb className={breadcrumbOnDarkClass} items={breadcrumb} />

          <EyebrowPill variant="onDark" className="mt-8 w-fit">{eyebrow}</EyebrowPill>

          <h1
            id={id}
            className={cn(
              "hero-heading mt-8 w-full max-w-5xl text-balance text-white",
              titleClassName
            )}
          >
            <span className="block">{title}</span>
            {titleLine2 ? <span className="block">{titleLine2}</span> : null}
          </h1>

          {tagline ? (
            <p className="mt-4 text-lg font-medium tracking-tight text-white/90 sm:text-xl">{tagline}</p>
          ) : null}

          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
          ) : null}

          {children}

          {cta ? (
            <Link
              href={cta.href}
              className={cn(brandCtaClass, "mt-8 h-12 px-7 text-sm hover:shadow-[0_12px_40px_rgba(24,93,241,0.35)]")}
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
