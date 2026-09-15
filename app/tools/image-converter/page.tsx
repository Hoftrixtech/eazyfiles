import type { Metadata } from "next";
import { ConverterGuide } from "@/components/converter/ConverterGuide";
import { ImageConverter } from "@/components/converter/ImageConverter";
import { FAQ } from "@/components/sections/FAQ";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { Container } from "@/components/ui/Container";
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
        eyebrow="Free online tool"
        title="Free Image Converter Online"
        description={converter.longDescription}
      />
      <ImageConverter />
      <ConverterGuide />
      <FAQ id="converter-faq" />
      <Container className="section-padding border-t border-border">
        <RelatedTools slug={converter.slug} />
      </Container>
    </main>
  );
}
