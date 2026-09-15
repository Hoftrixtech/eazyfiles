import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import type { Tool } from "@/types/tools";

export function serializeJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: siteUrl,
    description: APP_TAGLINE,
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl("/brand/eazyfiles-mark.svg"),
  };
}

export function webApplicationJsonLd(tool: Tool): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: absoluteUrl(tool.route),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    description: tool.seoDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
