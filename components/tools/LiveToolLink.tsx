import Link from "next/link";
import { getToolBySlug } from "@/lib/tools";
import type { Tool } from "@/types/tools";

const FALLBACK_NAMES: Record<string, string> = {
  "image-compressor": "Image Compressor",
  "image-resizer": "Image Resizer",
  "image-cropper": "Image Cropper",
  "image-converter": "Image Converter",
};

export function LiveToolLink({ slug }: { slug: Tool["slug"] }) {
  const tool = getToolBySlug(slug);
  const fallback = FALLBACK_NAMES[slug] ?? slug;

  if (!tool || tool.status !== "live") {
    return fallback;
  }

  return (
    <Link href={tool.route} className="font-medium text-foreground underline-offset-2 hover:underline">
      {tool.name}
    </Link>
  );
}
