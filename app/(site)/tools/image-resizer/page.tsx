import type { Metadata } from "next";
import { ImageResizer } from "@/components/resizer/ImageResizer";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { ToolPageMarketingSections } from "@/components/tools/ToolPageMarketingSections";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { createToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

function requireResizer() {
  const tool = getToolBySlug("image-resizer");
  if (!tool) {
    throw new Error("The Image Resizer tool is missing from the catalog.");
  }
  return tool;
}

const resizer = requireResizer();

export const metadata: Metadata = createToolMetadata(resizer, { absoluteTitle: true });

export default function ImageResizerPage() {
  return (
    <main>
      <ToolJsonLd tool={resizer} />
      <ToolPageIntro
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Image Resizer" },
        ]}
        eyebrow="Free online tool"
        title="Free Image Resizer Online"
        description="Resize JPG, PNG, and WebP images online by setting custom width and height, scaling by percentage, or choosing a preset. Keep the aspect ratio to maintain the image’s proportions."
      />
      <ImageResizer />
      <ToolPageMarketingSections toolSlug={resizer.slug} faqId="resizer-faq" />
    </main>
  );
}
