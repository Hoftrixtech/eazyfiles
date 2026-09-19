import type { Metadata } from "next";
import { APP_NAME, BRAND_LOGO_PATH, SITE_URL } from "@/lib/constants";
import type { Tool, ToolCategory } from "@/types/tools";

/** Default Open Graph / social preview image (brand logo). */
export const DEFAULT_OG_IMAGE_PATH = BRAND_LOGO_PATH;

export const PUBLIC_SITEMAP_PATHS = [
  "/",
  "/tools/image-compressor",
  "/tools/image-resizer",
  "/tools/image-cropper",
  "/tools/image-converter",
  "/tools/image-to-pdf",
  "/about",
  "/how-it-works",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
] as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  return SITE_URL;
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "/" : normalized}`;
}

function openGraphImage(alt: string) {
  return {
    url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    width: 512,
    height: 512,
    alt,
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  /** When false, omit canonical (e.g. 404). */
  canonical?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = false,
  canonical = true,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = openGraphImage(`${APP_NAME} — ${title}`);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: canonical
      ? {
          canonical: url,
        }
      : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: APP_NAME,
      title,
      description,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    },
  };
}

export function createToolMetadata(tool: Tool, options?: { absoluteTitle?: boolean }): Metadata {
  return createPageMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    path: tool.route,
    absoluteTitle: options?.absoluteTitle,
  });
}

export function createCategoryMetadata(category: ToolCategory): Metadata {
  return createPageMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/tools/${category.slug}`,
  });
}

export const HOME_PAGE_SEO = {
  title: "EazyFiles – Free Online Image & File Tools",
  description:
    "EazyFiles provides simple online tools to compress, resize, crop and convert images quickly and easily.",
} as const;
