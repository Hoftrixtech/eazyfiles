import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const benefits = [
  {
    title: "Fast & Simple",
    body: "No complicated settings. Upload, choose your options, and download.",
  },
  {
    title: "Target File Size",
    body: "Compress toward the size you actually need, not a vague quality slider.",
  },
  {
    title: "Popular Formats",
    body: "Work with JPG, PNG and WebP in the browser.",
  },
  {
    title: "Works Everywhere",
    body: "Use EazyFiles on desktop, tablet and mobile.",
  },
  {
    title: "Privacy Focused",
    body: "Uploads are processed temporarily and removed after processing. Images are not stored in the database.",
  },
];

export function WhyUseThisTool() {
  return (
    <section className="section-padding bg-card/30">
      <Container>
        <SectionHeader eyebrow="Benefits" title="Why EazyFiles" description="Built for everyday image tasks without desktop software." />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border/60 bg-card/60 p-6 ring-1 ring-white/[0.03] sm:p-8"
            >
              <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
