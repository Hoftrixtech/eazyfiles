import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Upload",
    body: "Choose your image.",
  },
  {
    number: "02",
    title: "Customize",
    body: "Select the size or image option you need.",
  },
  {
    number: "03",
    title: "Download",
    body: "Get your optimized image instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding section-surface scroll-mt-24 bg-background">
      <Container>
        <SectionHeader eyebrow="Workflow" title="How it works" description="Three steps from upload to download." />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="relative rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted/80 text-xs font-semibold tracking-widest text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
