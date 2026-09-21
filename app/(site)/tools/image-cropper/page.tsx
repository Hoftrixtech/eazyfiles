import type { Metadata } from "next";
import { ImageCropper } from "@/components/cropper/ImageCropper";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { ToolPageMarketingSections } from "@/components/tools/ToolPageMarketingSections";
import { ToolPageIntro } from "@/components/tools/ToolPageIntro";
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
        eyebrow="Free online image cropper"
        title="Crop Images Online to the Size You Need"
        description="Upload a JPG, PNG, or WebP image, select the area you want to keep, and crop it online. Use available aspect ratio options such as 1:1 or 16:9, then download your cropped image."
      />
      <ImageCropper />
      <ToolPageMarketingSections toolSlug={cropper.slug} faqId="cropper-faq" />
    </main>
  );
}
