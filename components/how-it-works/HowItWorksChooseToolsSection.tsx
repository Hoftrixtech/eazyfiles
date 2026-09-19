import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { APP_NAME } from "@/lib/constants";
import { ToolIcon, getPublicToolHref, getToolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/tools";

const TOOL_PRESENTATION: Record<
  string,
  {
    description: string;
    cta: string;
    iconClassName: string;
  }
> = {
  "image-compressor": {
    description:
      "Reduce image file size with target sizes such as 50 KB, 100 KB, 200 KB, 500 KB, 1 MB, or a custom size.",
    cta: "Use Compressor →",
    iconClassName: "bg-emerald-500/15 text-emerald-600",
  },
  "image-resizer": {
    description: "Change image dimensions by setting custom width and height or using available resizing options.",
    cta: "Use Resizer →",
    iconClassName: "bg-sky-500/15 text-sky-600",
  },
  "image-cropper": {
    description:
      "Crop an image to the area you need and use available aspect ratio options for common image sizes.",
    cta: "Use Cropper →",
    iconClassName: "bg-violet-500/15 text-violet-600",
  },
  "image-converter": {
    description: "Convert supported images between JPG, PNG, and WebP formats based on your output needs.",
    cta: "Use Converter →",
    iconClassName: "bg-amber-500/15 text-amber-600",
  },
  "image-to-pdf": {
    description: "Combine one or more images into a downloadable PDF with image-sized or A4 page layouts.",
    cta: "Use Image to PDF →",
    iconClassName: "bg-rose-500/15 text-rose-600",
  },
};

function ChooseToolCard({ tool }: { tool: Tool }) {
  const presentation = TOOL_PRESENTATION[tool.slug];
  const href = getPublicToolHref(tool);
  const description = presentation?.description ?? tool.shortDescription;
  const cta = presentation?.cta ?? `Use ${tool.name} →`;
  const iconClassName = presentation?.iconClassName ?? "bg-primary/10 text-primary";

  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      className="group block btn-radius focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <article
        className={cn(
          "btn-radius flex h-full min-h-[260px] flex-col border border-border bg-card p-6 sm:p-7",
          "transition-[box-shadow,border-color,transform] duration-300",
          "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
        )}
      >
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl",
            iconClassName
          )}
          aria-hidden="true"
        >
          <ToolIcon name={tool.icon} className="size-5" />
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">{tool.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
        <span className="brand-text-link mt-6 w-fit text-sm font-medium transition-opacity group-hover:opacity-90">
          {cta}
        </span>
      </article>
    </Link>
  );
}

export function HowItWorksChooseToolsSection() {
  const tools = getToolsByCategory("image-tools").filter((tool) => tool.status === "live");

  return (
    <section className="section-padding bg-muted/35" aria-labelledby="how-it-works-tools-heading">
      <Container className="max-w-[90rem]">
        <header className="max-w-3xl">
          <EyebrowPill className="w-fit">Our image tools</EyebrowPill>
          <h2 id="how-it-works-tools-heading" className="section-heading mt-6 text-balance text-foreground">
            Choose the Tool You Need.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {APP_NAME} provides four online image tools for common tasks. Choose the tool that matches what you need to
            do with your image.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 xl:grid-cols-4">
          {tools.map((tool) => (
            <ChooseToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
