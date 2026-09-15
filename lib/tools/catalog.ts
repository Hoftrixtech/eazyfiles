import { TOOL_CATEGORIES } from "@/lib/tools/categories";
import type { Tool, ToolCategoryId } from "@/types/tools";

export const TOOLS: readonly Tool[] = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription: "Reduce JPG, PNG and WebP files to a target size and download the result.",
    longDescription:
      "Upload an image, choose a target size, and compress on the server. The compressor aims for the highest quality that stays at or below your target.",
    category: "image-tools",
    icon: "image-down",
    status: "live",
    route: "/",
    keywords: ["compress image", "reduce image size", "jpg compressor", "png compressor", "webp compressor"],
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedTools: ["image-resizer", "image-converter", "image-cropper"],
    seoTitle: "Free Image Compressor Online – Reduce Image Size | EazyFiles",
    seoDescription:
      "Compress JPG, PNG and WebP images online for free. Reduce image file size to a target size quickly without installing software.",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Change image width and height while keeping the file easy to share.",
    longDescription:
      "Upload an image, then set a custom width and height, scale by percent, or pick a common preset. Keep the aspect ratio on to avoid stretching, or turn it off for exact frames.",
    category: "image-tools",
    icon: "scaling",
    status: "live",
    route: "/tools/image-resizer",
    keywords: ["resize image", "change image dimensions", "image resizer"],
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedTools: ["image-compressor", "image-cropper", "image-converter"],
    seoTitle: "Image Resizer Online – Resize JPG, PNG & WebP | EazyFiles",
    seoDescription:
      "Resize JPG, PNG and WebP images online with custom dimensions, presets and aspect-ratio control. Fast, simple and free with EazyFiles.",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortDescription: "Crop an image to the area you need before you compress or convert it.",
    longDescription:
      "Upload an image, drag the crop box, optionally lock a ratio such as 1:1 or 16:9, then download JPG, PNG or WebP. The selected region is cropped on the server.",
    category: "image-tools",
    icon: "crop",
    status: "live",
    route: "/tools/image-cropper",
    keywords: ["crop image", "trim image", "crop jpg", "crop png", "crop webp"],
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedTools: ["image-resizer", "image-compressor", "image-converter"],
    seoTitle: "Image Cropper Online – Crop JPG, PNG & WebP | EazyFiles",
    seoDescription:
      "Crop JPG, PNG and WebP images online with flexible aspect ratios. Quickly crop and download your image for free with EazyFiles.",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert between JPG, PNG and WebP without rebuilding the rest of the site.",
    longDescription:
      "Upload an image, choose JPEG, PNG or WebP, and convert on the server. Keep high quality by default, or pick a smaller-file preset when you need it.",
    category: "image-tools",
    icon: "repeat",
    status: "live",
    route: "/tools/image-converter",
    keywords: ["convert image", "jpg to webp", "png to jpg", "webp to png", "image converter"],
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedTools: ["image-compressor", "image-resizer", "image-cropper"],
    seoTitle: "Image Converter Online – Convert JPG, PNG & WebP | EazyFiles",
    seoDescription:
      "Convert JPG, PNG and WebP images online with high-quality output. Quickly convert image formats for free with EazyFiles.",
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    shortDescription: "Reduce PDF file size for email and uploads.",
    longDescription: "PDF compression will use the same tool architecture as the image compressor. It is not available yet.",
    category: "pdf-tools",
    icon: "file-down",
    status: "coming-soon",
    route: "/tools/pdf-compressor",
    keywords: ["compress pdf", "reduce pdf size"],
    supportedFormats: ["PDF"],
    relatedTools: ["pdf-merger"],
    seoTitle: "PDF Compressor",
    seoDescription: "Compress PDF files online. This tool is coming soon.",
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    shortDescription: "Combine multiple PDF files into one document.",
    longDescription: "Merge PDFs in a later release. This entry reserves the route and related-tool links.",
    category: "pdf-tools",
    icon: "files",
    status: "coming-soon",
    route: "/tools/pdf-merger",
    keywords: ["merge pdf", "combine pdf"],
    supportedFormats: ["PDF"],
    relatedTools: ["pdf-compressor"],
    seoTitle: "PDF Merger",
    seoDescription: "Merge PDF files online. This tool is coming soon.",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription: "Count words, characters and sentences in a block of text.",
    longDescription: "A word counter will be added as a text tool. It is not live yet.",
    category: "text-tools",
    icon: "type",
    status: "coming-soon",
    route: "/tools/word-counter",
    keywords: ["word count", "character count"],
    relatedTools: ["json-formatter"],
    seoTitle: "Word Counter",
    seoDescription: "Count words and characters online. This tool is coming soon.",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Pretty-print and validate JSON in the browser.",
    longDescription: "JSON formatting is planned as a developer-friendly text tool. It is not implemented yet.",
    category: "text-tools",
    icon: "braces",
    status: "coming-soon",
    route: "/tools/json-formatter",
    keywords: ["format json", "pretty print json"],
    relatedTools: ["word-counter"],
    seoTitle: "JSON Formatter",
    seoDescription: "Format and inspect JSON online. This tool is coming soon.",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortDescription: "Work out percentages, increases and remaining amounts.",
    longDescription: "A percentage calculator will be added under Calculator Tools. It is not live yet.",
    category: "calculator-tools",
    icon: "percent",
    status: "coming-soon",
    route: "/tools/percentage-calculator",
    keywords: ["percentage calculator"],
    relatedTools: ["emi-calculator"],
    seoTitle: "Percentage Calculator",
    seoDescription: "Calculate percentages online. This tool is coming soon.",
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    shortDescription: "Estimate monthly loan payments from amount, rate and tenure.",
    longDescription: "An EMI calculator is reserved in the catalog and will be built later.",
    category: "calculator-tools",
    icon: "calculator",
    status: "coming-soon",
    route: "/tools/emi-calculator",
    keywords: ["emi calculator", "loan calculator"],
    relatedTools: ["percentage-calculator"],
    seoTitle: "EMI Calculator",
    seoDescription: "Calculate EMI online. This tool is coming soon.",
  },
] as const;

const toolsBySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));
const categoriesBySlug = new Map(TOOL_CATEGORIES.map((category) => [category.slug, category]));
const categoriesById = new Map(TOOL_CATEGORIES.map((category) => [category.id, category]));

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsBySlug.get(slug);
}

export function getCategoryBySlug(slug: string) {
  return categoriesBySlug.get(slug);
}

export function getCategoryById(id: ToolCategoryId) {
  return categoriesById.get(id);
}

export function getLiveTools(): Tool[] {
  return TOOLS.filter((tool) => tool.status === "live");
}

export function getToolsByCategory(categoryId: ToolCategoryId): Tool[] {
  return TOOLS.filter((tool) => tool.category === categoryId);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return [];
  }

  return tool.relatedTools.flatMap((relatedSlug) => {
    const related = getToolBySlug(relatedSlug);
    if (!related || related.slug === slug) {
      return [];
    }

    return [related];
  });
}

export function getPublicToolHref(tool: Tool): string | null {
  return tool.status === "live" ? tool.route : null;
}

export function getIndexableToolPaths(): string[] {
  const paths = new Set<string>(["/tools"]);

  for (const category of TOOL_CATEGORIES) {
    paths.add(`/tools/${category.slug}`);
  }

  for (const tool of getLiveTools()) {
    paths.add(tool.route);
  }

  return [...paths];
}

export function getStaticToolDirectorySlugs(): string[] {
  const slugs = TOOL_CATEGORIES.map((category) => category.slug);
  for (const tool of getLiveTools()) {
    if (tool.route !== `/tools/${tool.slug}`) {
      slugs.push(tool.slug);
    }
  }
  return slugs;
}
