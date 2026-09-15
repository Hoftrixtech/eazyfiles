import { describe, expect, it } from "vitest";
import { PUBLIC_SITEMAP_PATHS } from "@/lib/seo";
import { serializeJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

describe("SEO sitemap paths", () => {
  it("lists launch public pages only", () => {
    expect(PUBLIC_SITEMAP_PATHS).toEqual([
      "/",
      "/tools/image-compressor",
      "/tools/image-resizer",
      "/tools/image-cropper",
      "/tools/image-converter",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
    ]);
    expect(PUBLIC_SITEMAP_PATHS).not.toContain("/login");
    expect(PUBLIC_SITEMAP_PATHS).not.toContain("/account");
  });
});

describe("JSON-LD", () => {
  it("serializes valid JSON", () => {
    const json = serializeJsonLd(websiteJsonLd());
    expect(() => JSON.parse(json)).not.toThrow();
    expect(JSON.parse(json)["@type"]).toBe("WebSite");
  });
});
