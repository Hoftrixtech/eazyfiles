import { FileImage, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import {
  DEFAULT_SUPPORTED_FORMATS_CONTENT,
  getSupportedFormatsContent,
} from "@/lib/tools/supported-formats-content";
import { cn } from "@/lib/utils";

function FormatCard({
  name,
  body,
  iconClassName,
}: {
  name: string;
  body: string;
  iconClassName: string;
}) {
  return (
    <article
      className={cn(
        "btn-radius flex h-full flex-col border border-border/80 bg-card p-6 sm:p-7",
        "shadow-[var(--shadow-elevated)]"
      )}
    >
      <span
        className={cn("flex size-11 items-center justify-center rounded-xl", iconClassName)}
        aria-hidden="true"
      >
        {name === "PDF" ? (
          <FileText className="size-5" strokeWidth={1.75} />
        ) : (
          <FileImage className="size-5" strokeWidth={1.75} />
        )}
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">{body}</p>
    </article>
  );
}

export function HowItWorksSupportedFormatsSection({ toolSlug }: { toolSlug?: string } = {}) {
  const content = toolSlug ? getSupportedFormatsContent(toolSlug) : DEFAULT_SUPPORTED_FORMATS_CONTENT;

  return (
    <section
      id="supported-formats"
      className="section-padding scroll-mt-24 bg-primary/[0.06]"
      aria-labelledby="how-it-works-formats-heading"
    >
      <Container className="max-w-[90rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-14 xl:grid-cols-[minmax(0,26rem)_1fr]">
          <header className="max-w-md">
            <EyebrowPill className="w-fit">{content.eyebrow}</EyebrowPill>
            <h2
              id="how-it-works-formats-heading"
              className="section-heading mt-6 text-balance text-foreground"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{content.description}</p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {content.formats.map((format) => (
              <FormatCard key={format.name} {...format} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
