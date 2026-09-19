import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { DEFAULT_HOW_IT_WORKS_CONTENT, getHowItWorksContent } from "@/lib/tools/how-it-works-content";
import { cn } from "@/lib/utils";

function StepCard({ title, body }: { title: string; body: string }) {
  return (
    <article
      className={cn(
        "btn-radius flex h-full min-h-[180px] flex-col border border-border bg-muted/40 p-7 sm:p-8",
        "transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
      )}
    >
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">{body}</p>
    </article>
  );
}

export function HowItWorks({
  id = "how-it-works",
  toolSlug,
}: {
  id?: string;
  toolSlug?: string;
}) {
  const content = toolSlug ? getHowItWorksContent(toolSlug) : DEFAULT_HOW_IT_WORKS_CONTENT;
  const steps = content.steps;

  return (
    <section id={id} className="section-padding scroll-mt-24 bg-background">
      <Container className="max-w-[90rem]">
        <header className="mx-auto w-full max-w-5xl text-center lg:mx-0 lg:max-w-4xl lg:text-left">
          <EyebrowPill className="mx-auto w-fit lg:mx-0">{content.eyebrow}</EyebrowPill>
          <SplitHeading className="mt-5" align="left" lead={content.title} accent={content.accent} />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{content.description}</p>
        </header>

        <div className="mt-12 flex flex-col gap-4 lg:mt-14 lg:hidden">
          {steps.map((step) => (
            <StepCard key={step.title} title={step.title} body={step.body} />
          ))}
        </div>

        <div className="mt-12 hidden gap-3 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
          <StepCard title={steps[0].title} body={steps[0].body} />
          <div className="flex items-center justify-center text-primary" aria-hidden="true">
            <ArrowRight className="size-5" />
          </div>
          <StepCard title={steps[1].title} body={steps[1].body} />
          <div className="flex items-center justify-center text-primary" aria-hidden="true">
            <ArrowRight className="size-5" />
          </div>
          <StepCard title={steps[2].title} body={steps[2].body} />
        </div>
      </Container>
    </section>
  );
}
