import type { MetadataRoute } from "next";
import { FUTURE_SEO_PATHS } from "@/lib/constants";
import { PUBLIC_SITEMAP_PATHS, getSiteUrl } from "@/lib/seo";

export { FUTURE_SEO_PATHS };

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return PUBLIC_SITEMAP_PATHS.map((path) => ({
    url: path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
