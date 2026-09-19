import type { Metadata } from "next";
import { ImageConverter } from "@/components/converter/ImageConverter";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { ToolPageMarketingSections } from "@/components/tools/ToolPageMarketingSections";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { createToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

function requireConverter() {
  const tool = getToolBySlug("image-converter");
  if (!tool) {
    throw new Error("The Image Converter tool is missing from the catalog.");
  }
  return tool;
}

const converter = requireConverter();

export const metadata: Metadata = createToolMetadata(converter, { absoluteTitle: true });

export default function ImageConverterPage() {
  return (
    <main>
      <ToolJsonLd tool={converter} />
      <ToolPageIntro
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Image Converter" },
        ]}
        eyebrow="Free online image converter"
        title="Convert Images Online"
        titleLine2="to JPG, PNG, or WebP"
        description="Convert JPG, PNG, and WebP images online to another supported format. Choose your output format and quality, then download the converted file."
      />
      <ImageConverter />
      <ToolPageMarketingSections toolSlug={converter.slug} faqId="converter-faq" />
    </main>
  );
}
