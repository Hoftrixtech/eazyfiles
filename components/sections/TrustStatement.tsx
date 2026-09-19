import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ToolIcon, TOOLS, getCategoryById } from "@/lib/tools";
import { cn } from "@/lib/utils";

const comingSoonTools = TOOLS.filter((tool) => tool.status === "coming-soon");

export function TrustStatement() {
  return (
    <section className="bg-muted/30">
      <Container className="section-padding max-w-[90rem]">
        <header className="mx-auto w-full max-w-5xl text-center">
          <EyebrowPill className="mx-auto w-fit">More tools coming soon</EyebrowPill>
          <SplitHeading
            className="mt-5"
            lead="More Online Tools for Images, PDFs &amp; Files"
            accent="Simple Tools for Everyday File Tasks."
          />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            EazyFiles is expanding with more online tools for common image, PDF, and file tasks. Explore our available
            tools today and discover more useful utilities as they are added to the toolkit.
          </p>
        </header>

        {comingSoonTools.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {comingSoonTools.map((tool) => {
              const category = getCategoryById(tool.category);

              return (
                  <article
                    key={tool.slug}
                    className={cn(
                      "btn-radius flex h-full min-h-[200px] flex-col border border-border bg-card p-6 sm:p-7",
                      "opacity-95"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground"
                        aria-hidden="true"
                      >
                        <ToolIcon name={tool.icon} className="size-4" />
                      </span>
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    </div>
                    {category ? (
                      <p className="mt-4 text-xs font-medium tracking-[0.16em] text-brand-accent uppercase">
                        {category.name}
                      </p>
                    ) : null}
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{tool.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.shortDescription}</p>
                    <p className="mt-6 text-sm font-medium text-muted-foreground">Coming soon — not available yet</p>
                  </article>
              );
            })}
          </div>
        ) : null}

        <p className="mt-12 text-center">
          <Link href="/tools" className="brand-text-link text-base transition-opacity hover:opacity-90">
            Explore All Tools →
          </Link>
        </p>
      </Container>
    </section>
  );
}
