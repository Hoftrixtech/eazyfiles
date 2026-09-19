export type WhyUseBenefit = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type WhyUseThisToolContent = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  benefits: readonly [WhyUseBenefit, WhyUseBenefit, WhyUseBenefit, WhyUseBenefit, WhyUseBenefit];
  bottomCta: { label: string; href: string };
};

export const DEFAULT_WHY_USE_THIS_TOOL_CONTENT: WhyUseThisToolContent = {
  eyebrow: "Benefits",
  title: "Simple Online Image Tools for",
  accent: "Everyday Tasks.",
  description:
    "EazyFiles brings essential image tools together in one place. Compress, resize, crop, and convert JPG, PNG, and WebP images with simple controls and practical options.",
  benefits: [
    {
      title: "Simple & Fast",
      body:
        "Upload your image, choose the settings you need, and download the processed file with a straightforward workflow.",
      href: "#compressor",
      cta: "Try the Image Compressor →",
    },
    {
      title: "Target File Size",
      body:
        "Choose a target file size when compressing images, with options for common sizes such as 50 KB, 100 KB, 200 KB, 500 KB, and 1 MB.",
      href: "#compressor",
      cta: "Set a Target Size →",
    },
    {
      title: "JPG, PNG & WebP",
      body: "Work with popular image formats including JPG, PNG, and WebP across EazyFiles image tools.",
      href: "#image-tools",
      cta: "Explore Image Tools →",
    },
    {
      title: "Works Across Devices",
      body: "Use EazyFiles image tools on desktop, tablet, or mobile through your web browser.",
      href: "/how-it-works",
      cta: "See How It Works →",
    },
    {
      title: "Privacy Focused",
      body:
        "Uploaded images are processed temporarily and removed after processing. Image files are not stored in the database.",
      href: "/privacy",
      cta: "Read Our Privacy Policy →",
    },
  ],
  bottomCta: {
    label: "Explore All Image Tools →",
    href: "/tools?category=image-tools",
  },
};

const TOOL_WHY_USE_CONTENT: Partial<Record<string, WhyUseThisToolContent>> = {
  "image-compressor": {
    eyebrow: "Benefits",
    title: "Simple Image Compression for",
    accent: "Everyday Tasks.",
    description:
      "Reduce JPG, PNG, and WebP file sizes with practical target-size options and a straightforward compression workflow.",
    benefits: [
      {
        title: "Choose a Target Size",
        body: "Select 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom target size.",
        href: "#tool-compressor",
        cta: "Set a Target Size →",
      },
      {
        title: "JPG, PNG & WebP Support",
        body: "Compress supported JPG, PNG, and WebP images and choose an available output format.",
        href: "#supported-formats",
        cta: "Explore Image Formats →",
      },
      {
        title: "Reduce Image File Size",
        body: "Compress images toward your selected target size to create smaller files for your digital needs.",
        href: "#tool-compressor",
        cta: "Compress an Image →",
      },
      {
        title: "Multiple Images",
        body:
          "Upload multiple supported images when available and process them through the same compression workflow.",
        href: "#tool-compressor",
        cta: "Try Image Compressor →",
      },
      {
        title: "Temporary File Processing",
        body:
          "Uploaded image files are processed temporarily and removed after processing. Image files are not stored in the database.",
        href: "/privacy",
        cta: "Read Our Privacy Policy →",
      },
    ],
    bottomCta: {
      label: "Explore Image Compressor →",
      href: "/tools/image-compressor#tool-compressor",
    },
  },
  "image-converter": {
    eyebrow: "Benefits",
    title: "Simple Online Image Conversion for",
    accent: "Everyday Tasks.",
    description:
      "EazyFiles makes it easy to convert JPG, PNG, and WebP images with clear format and quality options.",
    benefits: [
      {
        title: "Simple & Straightforward",
        body:
          "Upload your image, choose an output format and quality setting, then download the converted file.",
        href: "#converter",
        cta: "Try Image Converter →",
      },
      {
        title: "Multiple Output Formats",
        body: "Convert images to JPG, PNG, or WebP based on the format you need.",
        href: "#supported-formats",
        cta: "Explore Formats →",
      },
      {
        title: "Quality Options",
        body: "Choose High, Balanced, or Smaller File settings when converting supported images.",
        href: "#converter",
        cta: "Choose Quality →",
      },
      {
        title: "Works Across Devices",
        body: "Use the EazyFiles Image Converter on desktop, tablet, or mobile through your web browser.",
        href: "#converter",
        cta: "Convert on Any Device →",
      },
      {
        title: "Easy Format Conversion",
        body:
          "Convert images between popular formats for websites, content, documents, and other digital uses.",
        href: "#converter",
        cta: "Convert an Image →",
      },
    ],
    bottomCta: {
      label: "Explore All Image Tools →",
      href: "/tools?category=image-tools",
    },
  },
  "image-cropper": {
    eyebrow: "Benefits",
    title: "Simple Online Image Cropping for",
    accent: "Everyday Tasks.",
    description:
      "Crop JPG, PNG, and WebP images online with practical controls for selecting the area you need, choosing an aspect ratio, and selecting an output format.",
    benefits: [
      {
        title: "Crop the Area You Need",
        body: "Select the part of your image you want to keep and remove unwanted areas with the crop tool.",
        href: "#cropper",
        cta: "Crop an Image →",
      },
      {
        title: "Choose an Aspect Ratio",
        body:
          "Use available aspect ratio options when you need a specific shape or dimension for your cropped image.",
        href: "#cropper",
        cta: "Choose a Ratio →",
      },
      {
        title: "JPG, PNG & WebP",
        body: "Crop supported JPG, PNG, and WebP images and choose an available output format.",
        href: "#supported-formats",
        cta: "Explore Formats →",
      },
      {
        title: "Simple Cropping Workflow",
        body: "Upload your image, adjust the crop area, select your output format, and download the cropped result.",
        href: "#cropper",
        cta: "Try Image Cropper →",
      },
      {
        title: "Up to 10 MB Per Image",
        body: "Upload supported image files up to 10 MB per file and crop them online through EazyFiles.",
        href: "#cropper",
        cta: "Crop Images Online →",
      },
    ],
    bottomCta: {
      label: "Explore Image Cropper →",
      href: "/tools/image-cropper#cropper",
    },
  },
  "image-resizer": {
    eyebrow: "Benefits",
    title: "Simple Online Image Resizing for",
    accent: "Everyday Tasks.",
    description:
      "Resize JPG, PNG, and WebP images with practical controls for dimensions, scaling, aspect ratio, and output format.",
    benefits: [
      {
        title: "Custom Image Dimensions",
        body: "Set your required width and height in pixels, or choose a common size preset.",
        href: "#resizer",
        cta: "Resize an Image →",
      },
      {
        title: "Scale by Percentage",
        body: "Resize an image to 25%, 50%, 75%, or 100% of its original dimensions.",
        href: "#resizer",
        cta: "Try Image Resizer →",
      },
      {
        title: "JPG, PNG & WebP",
        body: "Resize images in JPG, PNG, and WebP formats and choose an available output format.",
        href: "#supported-formats",
        cta: "Explore Formats →",
      },
      {
        title: "Maintain Aspect Ratio",
        body:
          "Keep the original proportions while changing the image width or height to help avoid unwanted stretching.",
        href: "#resizer",
        cta: "Resize Images →",
      },
      {
        title: "Common Size Presets",
        body:
          "Choose preset dimensions such as 1920 × 1080, 1280 × 720, 1080 × 1080, or other available sizes.",
        href: "#resizer",
        cta: "Choose a Size →",
      },
    ],
    bottomCta: {
      label: "Explore Image Resizer →",
      href: "/tools/image-resizer#resizer",
    },
  },
};

export function getWhyUseThisToolContent(toolSlug?: string): WhyUseThisToolContent {
  if (toolSlug && TOOL_WHY_USE_CONTENT[toolSlug]) {
    return TOOL_WHY_USE_CONTENT[toolSlug]!;
  }
  return DEFAULT_WHY_USE_THIS_TOOL_CONTENT;
}
