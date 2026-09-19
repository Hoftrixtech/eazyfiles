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
  formats: readonly SupportedFormatCard[];
};

const PDF_OUTPUT_CARD: SupportedFormatCard = {
  name: "PDF",
  body: "Turn JPG, PNG, or WebP images into a downloadable PDF with the Image to PDF tool.",
  iconClassName: "bg-rose-500/15 text-rose-600",
};

const PDF_OUTPUT_CARD_IMAGE_TO_PDF: SupportedFormatCard = {
  name: "PDF",
  body: "The output format — a standard PDF document you can share, print, or download.",
  iconClassName: "bg-rose-500/15 text-rose-600",
};

function withPdfOutput(cards: readonly SupportedFormatCard[]): readonly SupportedFormatCard[] {
  return [...cards, PDF_OUTPUT_CARD];
}

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
  formats: withPdfOutput(FORMAT_CARDS),
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
    formats: withPdfOutput(COMPRESSOR_FORMAT_CARDS),
  },
  "image-resizer": {
    eyebrow: "File formats",
    heading: "Work With Popular Image Formats.",
    description:
      `Resize JPG, PNG, and WebP images with ${APP_NAME}. Available output format options may vary depending on the image and settings you choose.`,
    formats: withPdfOutput(FORMAT_CARDS),
  },
  "image-cropper": {
    eyebrow: "File formats",
    heading: "Crop Popular Image Formats.",
    description:
      `${APP_NAME} lets you crop JPG, PNG, and WebP images online. Output format options may vary depending on the settings you choose.`,
    formats: withPdfOutput(FORMAT_CARDS),
  },
  "image-converter": {
    eyebrow: "File formats",
    heading: "Convert Between Popular Image Formats.",
    description:
      `${APP_NAME} supports JPG, PNG, and WebP for image conversion. Choose the output format that fits your website, content, or digital workflow.`,
    formats: withPdfOutput([
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
    ]),
  },
  "image-to-pdf": {
    eyebrow: "File formats",
    heading: "Supported Image Inputs for PDF",
    description:
      `${APP_NAME} accepts JPG, PNG, and WebP images for PDF creation. The downloaded file is a standard PDF document.`,
    formats: [
      {
        name: "JPG",
        body: "Photos and compressed images commonly saved as JPEG.",
        iconClassName: "bg-sky-500/15 text-sky-600",
      },
      {
        name: "PNG",
        body:
          "Images with sharp edges or transparency. Transparency is flattened when the image is embedded in the PDF.",
        iconClassName: "bg-emerald-500/15 text-emerald-600",
      },
      {
        name: "WebP",
        body:
          "Modern web images converted into PDF pages on the server. The output is a standard PDF download.",
        iconClassName: "bg-violet-500/15 text-violet-600",
      },
      PDF_OUTPUT_CARD_IMAGE_TO_PDF,
    ],
  },
};

export function getSupportedFormatsContent(toolSlug?: string): SupportedFormatsContent {
  if (toolSlug && TOOL_SUPPORTED_FORMATS_CONTENT[toolSlug]) {
    return TOOL_SUPPORTED_FORMATS_CONTENT[toolSlug]!;
  }
  return DEFAULT_SUPPORTED_FORMATS_CONTENT;
}
