import type { Metadata } from "next";
import { CropperGuide } from "@/components/cropper/CropperGuide";
import { ImageCropper } from "@/components/cropper/ImageCropper";
import { FAQ } from "@/components/sections/FAQ";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
import { Container } from "@/components/ui/Container";
import { createToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";

function requireCropper() {
  const tool = getToolBySlug("image-cropper");
  if (!tool) {
    throw new Error("The Image Cropper tool is missing from the catalog.");
  }
  return tool;
}

const cropper = requireCropper();

export const metadata: Metadata = createToolMetadata(cropper, { absoluteTitle: true });

export default function ImageCropperPage() {
  return (
    <main>
      <ToolJsonLd tool={cropper} />
      <ToolPageIntro
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Image Cropper" },
        ]}
        eyebrow="Free online tool"
        title="Free Image Cropper Online"
        description={cropper.longDescription}
      />
      <ImageCropper />
      <CropperGuide />
      <FAQ id="cropper-faq" />
      <Container className="section-padding border-t border-border">
        <RelatedTools slug={cropper.slug} />
      </Container>
    </main>
  );
}
