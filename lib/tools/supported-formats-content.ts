import { APP_NAME } from "@/lib/constants";

export type SupportedFormatCard = {
  name: string;
  body: string;
  iconClassName: string;
};

export type SupportedFormatsContent = {
  eyebrow: string;
  heading: string;
  description: string;
  formats: [SupportedFormatCard, SupportedFormatCard, SupportedFormatCard];
};

const FORMAT_CARDS: SupportedFormatsContent["formats"] = [
  {
    name: "JPG",
    body: "A widely used image format for photos, websites, and everyday digital content.",
    iconClassName: "bg-sky-500/15 text-sky-600",
  },
  {
    name: "PNG",
    body: "A popular format for high-quality images and graphics that require transparent backgrounds.",
    iconClassName: "bg-emerald-500/15 text-emerald-600",
  },
  {
    name: "WebP",
    body: "A modern image format that can provide smaller file sizes while maintaining good image quality.",
    iconClassName: "bg-violet-500/15 text-violet-600",
  },
];

export const DEFAULT_SUPPORTED_FORMATS_CONTENT: SupportedFormatsContent = {
  eyebrow: "File formats",
  heading: "Work With Popular Image Formats.",
  description:
    `${APP_NAME} supports JPG, PNG, and WebP across its available image tools. Format and output options may vary depending on the tool you choose.`,
  formats: FORMAT_CARDS,
};

const COMPRESSOR_FORMAT_CARDS: SupportedFormatsContent["formats"] = [
  {
    name: "JPG",
    body: "A widely used format for photos and web images, suitable for reducing file size for digital use.",
    iconClassName: "bg-sky-500/15 text-sky-600",
  },
  {
    name: "PNG",
    body: "A popular format for high-quality graphics and images that require transparent backgrounds.",
    iconClassName: "bg-emerald-500/15 text-emerald-600",
  },
  {
    name: "WebP",
    body: "A modern image format that can provide smaller file sizes while maintaining good image quality.",
    iconClassName: "bg-violet-500/15 text-violet-600",
  },
];

const TOOL_SUPPORTED_FORMATS_CONTENT: Partial<Record<string, SupportedFormatsContent>> = {
  "image-compressor": {
    eyebrow: "File formats",
    heading: "Compress Popular Image Formats.",
    description:
      `${APP_NAME} supports JPG, PNG, and WebP images for online compression. Choose the format that works best for your image and output needs.`,
    formats: COMPRESSOR_FORMAT_CARDS,
  },
  "image-resizer": {
    eyebrow: "File formats",
    heading: "Work With Popular Image Formats.",
    description:
      `Resize JPG, PNG, and WebP images with ${APP_NAME}. Available output format options may vary depending on the image and settings you choose.`,
    formats: FORMAT_CARDS,
  },
  "image-cropper": {
    eyebrow: "File formats",
    heading: "Crop Popular Image Formats.",
    description:
      `${APP_NAME} lets you crop JPG, PNG, and WebP images online. Output format options may vary depending on the settings you choose.`,
    formats: FORMAT_CARDS,
  },
  "image-converter": {
    eyebrow: "File formats",
    heading: "Convert Between Popular Image Formats.",
    description:
      `${APP_NAME} supports JPG, PNG, and WebP for image conversion. Choose the output format that fits your website, content, or digital workflow.`,
    formats: [
      {
        name: "JPG",
        body: "A widely used image format for photos, websites, and everyday digital content.",
        iconClassName: "bg-sky-500/15 text-sky-600",
      },
      {
        name: "PNG",
        body:
          "A popular format for high-quality images and graphics, including images that require transparent backgrounds.",
        iconClassName: "bg-emerald-500/15 text-emerald-600",
      },
      {
        name: "WebP",
        body: "A modern image format that can provide smaller file sizes while maintaining good image quality.",
        iconClassName: "bg-violet-500/15 text-violet-600",
      },
    ],
  },
};

export function getSupportedFormatsContent(toolSlug?: string): SupportedFormatsContent {
  if (toolSlug && TOOL_SUPPORTED_FORMATS_CONTENT[toolSlug]) {
    return TOOL_SUPPORTED_FORMATS_CONTENT[toolSlug]!;
  }
  return DEFAULT_SUPPORTED_FORMATS_CONTENT;
}
