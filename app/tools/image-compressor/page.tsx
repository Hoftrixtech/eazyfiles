import type { Metadata } from "next";
import { ImageCompressor } from "@/components/compressor/ImageCompressor";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { ToolPageMarketingSections } from "@/components/tools/ToolPageMarketingSections";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { createToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

function requireCompressor() {
  const tool = getToolBySlug("image-compressor");
  if (!tool) {
    throw new Error("The Image Compressor tool is missing from the catalog.");
  }
  return tool;
}

const compressor = requireCompressor();

export const metadata: Metadata = createToolMetadata(compressor, { absoluteTitle: true });

export default function ImageCompressorPage() {
  return (
    <main>
      <ToolJsonLd tool={compressor} />
      <ToolPageIntro
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Image Compressor" },
        ]}
        eyebrow="Free online image compressor"
        title="Compress Images Online to Reduce File Size"
        description="Compress JPG, PNG, and WebP images online to reduce file size. Choose a target size such as 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom target size."
      />
      <ImageCompressor id="tool-compressor" />
      <ToolPageMarketingSections toolSlug={compressor.slug} faqId="compressor-faq" />
    </main>
  );
}
