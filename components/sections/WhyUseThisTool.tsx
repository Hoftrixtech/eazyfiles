import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import {
  DEFAULT_WHY_USE_THIS_TOOL_CONTENT,
  getWhyUseThisToolContent,
} from "@/lib/tools/why-use-this-tool-content";
import { cn } from "@/lib/utils";

export function WhyUseThisTool({ toolSlug }: { toolSlug?: string } = {}) {
  const content = toolSlug ? getWhyUseThisToolContent(toolSlug) : DEFAULT_WHY_USE_THIS_TOOL_CONTENT;

  return (
    <section className="section-padding bg-muted/35">
      <Container>
        <header className="w-full max-w-5xl">
          <EyebrowPill className="w-fit">{content.eyebrow}</EyebrowPill>
          <SplitHeading className="mt-5" align="left" lead={content.title} accent={content.accent} />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{content.description}</p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {content.benefits.map((item) => (
            <article
              key={item.title}
              className={cn(
                "btn-radius flex min-h-[220px] flex-col border border-border bg-card p-7 sm:p-8",
                "transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
              )}
            >
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <Link href={item.href} className="brand-text-link mt-8 w-fit transition-opacity hover:opacity-90">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center lg:text-left">
          <Link
            href={content.bottomCta.href}
            className="brand-text-link text-base transition-opacity hover:opacity-90"
          >
            {content.bottomCta.label}
          </Link>
        </p>
      </Container>
    </section>
  );
}
