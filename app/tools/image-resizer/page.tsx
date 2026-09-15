import type { Metadata } from "next";
import { ImageResizer } from "@/components/resizer/ImageResizer";
import { ResizerGuide } from "@/components/resizer/ResizerGuide";
import { FAQ } from "@/components/sections/FAQ";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { Container } from "@/components/ui/Container";
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
        description={resizer.longDescription}
      />
      <ImageResizer />
      <ResizerGuide />
      <FAQ id="resizer-faq" />
      <Container className="section-padding border-t border-border">
        <RelatedTools slug={resizer.slug} />
      </Container>
    </main>
  );
}
