import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEFAULT_FAQ_CONTENT, getFaqContent } from "@/lib/tools/faq-content";

export function FAQ({ id = "faq", toolSlug }: { id?: string; toolSlug?: string }) {
  const content = toolSlug ? getFaqContent(toolSlug) : DEFAULT_FAQ_CONTENT;

  return (
    <section id={id} className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-4xl">
        <SectionHeader
          title={content.title}
          titleAccent={content.titleAccent}
          description={content.description}
        />
        <div className="mt-12 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {content.items.map((item) => (
            <details key={item.question} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 text-left font-medium transition-colors hover:text-foreground">
                <span>{item.question}</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="pb-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
