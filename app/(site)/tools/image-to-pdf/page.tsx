import type { Metadata } from "next";
import { ImageToPdf } from "@/components/image-to-pdf/ImageToPdf";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { ToolPageMarketingSections } from "@/components/tools/ToolPageMarketingSections";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { createToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

function requireImageToPdfTool() {
  const tool = getToolBySlug("image-to-pdf");
  if (!tool) {
    throw new Error("The Image to PDF tool is missing from the catalog.");
  }
  return tool;
}

const imageToPdf = requireImageToPdfTool();

export const metadata: Metadata = createToolMetadata(imageToPdf, { absoluteTitle: true });

export default function ImageToPdfPage() {
  return (
    <main>
      <ToolJsonLd tool={imageToPdf} />
      <ToolPageIntro
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Image to PDF" },
        ]}
        eyebrow="Free image to PDF converter"
        title="Convert Images to PDF Online in Seconds"
        description="Turn JPG, PNG, and WebP images into a downloadable PDF. Add multiple images to build a multi-page document."
      />
      <ImageToPdf />
      <ToolPageMarketingSections toolSlug={imageToPdf.slug} faqId="image-to-pdf-faq" />
    </main>
  );
}
