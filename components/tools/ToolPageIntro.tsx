import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";

export function ToolPageIntro({
  breadcrumb,
  title,
  description,
  eyebrow,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <section className="section-surface bg-card/40">
      <Container className="max-w-3xl py-10 sm:py-12">
        <Breadcrumb items={breadcrumb} />
        {eyebrow ? (
          <p className="mt-6 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      </Container>
    </section>
  );
}
