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
        <SectionHeader title="How it works" description="Three steps from upload to download." />
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="pt-6">
              <p className="text-4xl font-semibold tracking-tight text-foreground/15">{step.number}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
