import type { Metadata } from "next";
import { ImageCompressor } from "@/components/compressor/ImageCompressor";
import { FAQ } from "@/components/sections/FAQ";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportedFormats } from "@/components/sections/SupportedFormats";
import { WhyUseThisTool } from "@/components/sections/WhyUseThisTool";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { Container } from "@/components/ui/Container";
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
        eyebrow="Free online tool"
        title="Free Image Compressor Online"
        description="Reduce JPG, PNG or WebP images to a target file size. Upload, choose your settings, and download an optimized file in seconds."
      />
      <ImageCompressor id="tool-compressor" />
      <HowItWorks />
      <WhyUseThisTool />
      <SupportedFormats />
      <FAQ id="compressor-faq" />
      <Container className="section-padding border-t border-border">
        <RelatedTools slug={compressor.slug} />
      </Container>
    </main>
  );
}
