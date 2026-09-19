import Link from "next/link";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { Container } from "@/components/ui/Container";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const cells = [
  {
    label: "What we build",
    title: "Simple Online File Tools",
    body:
      "EazyFiles provides browser-based tools for common image and file tasks. Choose a tool, upload your file, select the options you need, and download the processed result.",
  },
  {
    label: "Why it matters",
    title: "Tools for Everyday File Tasks",
    body:
      "Common tasks like reducing image file size, changing dimensions, cropping, or converting formats should be straightforward. EazyFiles focuses on clear controls and simple workflows.",
  },
  {
    label: "Image tools",
    title: "Compress, Resize, Crop & Convert",
    body:
      "Use the Image Compressor, Image Resizer, Image Cropper, and Image Converter for common image tasks. Work with supported JPG, PNG, and WebP formats across the available tools.",
  },
  {
    label: "What's next",
    title: "More File Tools Coming Soon",
    body:
      "Image tools are the foundation of EazyFiles. We plan to add more online utilities for PDFs and other common file tasks as the platform grows.",
  },
] as const;

function cellBorderClass(index: number) {
  return cn(
    "p-8 sm:p-10 lg:p-12",
    index !== cells.length - 1 && "max-md:border-b border-border",
    index % 2 === 0 && "md:border-r border-border",
    index < 2 && "md:border-b border-border"
  );
}

export function AboutOverviewSection() {
  return (
    <section className="section-padding bg-background">
      <Container className="max-w-[90rem]">
        <header className="max-w-4xl">
          <EyebrowPill className="w-fit">How {APP_NAME} works</EyebrowPill>
          <h2 className="section-heading mt-6 max-w-5xl text-balance text-foreground">
            Four Simple Tools. One Easy Workflow.
          </h2>
        </header>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
          <div className="grid md:grid-cols-2">
            {cells.map((cell, index) => (
              <article key={cell.label} className={cellBorderClass(index)}>
                <p className="text-xs font-medium tracking-[0.16em] text-brand-accent uppercase">{cell.label}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{cell.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">{cell.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-muted/35 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">Try the Image Compressor</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with up to five free image compressions without signing in.
            </p>
          </div>
          <Link
            href="/tools/image-compressor"
            className="btn-radius brand-gradient-bg inline-flex h-11 shrink-0 items-center px-6 text-sm font-medium text-primary-foreground shadow-sm transition-[filter] hover:brightness-[1.06]"
          >
            Compress an Image →
          </Link>
        </div>
      </Container>
    </section>
  );
}
