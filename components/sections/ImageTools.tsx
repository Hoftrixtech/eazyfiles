import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";
import { getToolsByCategory } from "@/lib/tools";

const TOOL_CARD_COPY: Record<
  string,
  {
    description: string;
    cta: string;
  }
> = {
  "image-compressor": {
    description:
      "Compress JPG, PNG, and WebP images online to reduce file size while maintaining quality. Choose a target size such as 50 KB, 100 KB, or 1 MB.",
    cta: "Compress Images Online →",
  },
  "image-resizer": {
    description:
      "Resize images online by setting custom width and height, adjusting dimensions by percentage, or choosing a preset size. Keep the correct aspect ratio for clean results.",
    cta: "Resize Images Online →",
  },
  "image-cropper": {
    description:
      "Crop images online to remove unwanted areas or create the exact composition you need. Use custom dimensions or popular aspect ratios like 1:1 and 16:9.",
    cta: "Crop Images Online →",
  },
  "image-converter": {
    description:
      "Convert images online between JPG, PNG, and WebP formats. Choose the format you need for websites, social media, documents, and digital projects.",
    cta: "Convert Images Online →",
  },
};

export async function ImageToolsSection() {
  const tools = getToolsByCategory("image-tools").filter((tool) => tool.status === "live");

  return (
    <section id="image-tools" className="section-padding scroll-mt-24 bg-muted/35">
      <Container>
        <header className="mx-auto w-full max-w-5xl text-center">
          <EyebrowPill className="mx-auto w-fit">Our image tools</EyebrowPill>
          <SplitHeading
            className="mt-5"
            lead="Free Online Image Tools"
            accent="Compress, Resize, Crop &amp; Convert."
          />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Use our free online image tools to compress, resize, crop, and convert JPG, PNG, and WebP images. Quickly
            optimize your images for websites, social media, documents, and everyday digital work.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14">
          {tools.map((tool) => {
            const copy = TOOL_CARD_COPY[tool.slug];
            const description = copy?.description ?? tool.longDescription;
            const cta = copy?.cta ?? `Explore ${tool.name} →`;

            return (
              <Link
                key={tool.slug}
                href={tool.route}
                className="group block btn-radius focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <article
                  className={cn(
                    "btn-radius flex h-full min-h-[220px] flex-col border border-border bg-card p-7 sm:p-8",
                    "transition-[box-shadow,border-color,transform] duration-300",
                    "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-elevated)]"
                  )}
                >
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{tool.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                    {description}
                  </p>
                  <span className="brand-text-link mt-8 w-fit transition-opacity group-hover:opacity-90">{cta}</span>
                </article>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
