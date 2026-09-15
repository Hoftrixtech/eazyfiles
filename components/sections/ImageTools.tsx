import Link from "next/link";
import { ToolIcon } from "@/lib/tools";
import { getPublicToolAccessCopy } from "@/lib/plans";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getToolsByCategory } from "@/lib/tools";

const TOOL_COPY: Record<string, { description: string; href: string }> = {
  "image-compressor": {
    description: "Compress images to your target file size.",
    href: "/tools/image-compressor",
  },
  "image-resizer": {
    description: "Resize images to exact dimensions.",
    href: "/tools/image-resizer",
  },
  "image-cropper": {
    description: "Crop images quickly and precisely.",
    href: "/tools/image-cropper",
  },
  "image-converter": {
    description: "Convert between popular image formats.",
    href: "/tools/image-converter",
  },
};

export function ImageToolsSection() {
  const tools = getToolsByCategory("image-tools").filter((tool) => tool.status === "live");

  return (
    <section id="image-tools" className="section-padding scroll-mt-24 bg-background">
      <Container>
        <SectionHeader
          title="Everything You Need for Your Images"
          description="Simple tools for everyday image tasks."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const access = getPublicToolAccessCopy(tool.slug);
            const copy = TOOL_COPY[tool.slug];
            const available = access?.detail === "Available";
            return (
              <Link key={tool.slug} href={copy?.href ?? "/"} className="group block rounded-sm focus-visible:outline-none">
                <Card className="h-full border-transparent p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-md bg-muted text-foreground">
                      <ToolIcon name={tool.icon} className="size-5" />
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium tracking-wide uppercase",
                        available ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {access?.detail ?? "Coming soon"}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {copy?.description ?? tool.shortDescription}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
