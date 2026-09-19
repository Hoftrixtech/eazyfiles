import { describe, expect, it } from "vitest";
import {
  TOOL_CATEGORIES,
  TOOLS,
  getCategoryBySlug,
  getLiveTools,
  getPublicToolHref,
  getRelatedTools,
  getStaticToolDirectorySlugs,
  getToolBySlug,
  getToolsByCategory,
} from "@/lib/tools";

describe("tool catalog", () => {
  it("keeps tool slugs unique", () => {
    const slugs = TOOLS.map((tool) => tool.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("marks the five image tools as live", () => {
    const live = getLiveTools();
    expect(live.map((tool) => tool.slug)).toEqual([
      "image-compressor",
      "image-resizer",
      "image-cropper",
      "image-converter",
      "image-to-pdf",
    ]);
    expect(getPublicToolHref(getToolBySlug("image-compressor")!)).toBe("/");
    expect(getPublicToolHref(getToolBySlug("image-resizer")!)).toBe("/tools/image-resizer");
    expect(getPublicToolHref(getToolBySlug("image-cropper")!)).toBe("/tools/image-cropper");
    expect(getPublicToolHref(getToolBySlug("image-converter")!)).toBe("/tools/image-converter");
    expect(getPublicToolHref(getToolBySlug("image-to-pdf")!)).toBe("/tools/image-to-pdf");
  });

  it("keeps coming-soon tools from producing public hrefs", () => {
    const pdf = getToolBySlug("pdf-compressor");
    expect(pdf?.status).toBe("coming-soon");
    expect(getPublicToolHref(pdf!)).toBeNull();
  });

  it("resolves related tools from the central catalog", () => {
    const related = getRelatedTools("image-compressor");
    expect(related.map((tool) => tool.slug)).toEqual([
      "image-resizer",
      "image-converter",
      "image-to-pdf",
    ]);
  });

  it("groups image tools for the category page", () => {
    const imageTools = getToolsByCategory("image-tools");
    expect(imageTools.map((tool) => tool.slug)).toEqual([
      "image-compressor",
      "image-resizer",
      "image-cropper",
      "image-converter",
      "image-to-pdf",
    ]);
    expect(getCategoryBySlug("image-tools")?.name).toBe("Image Tools");
  });

  it("only statically generates category slugs and live tool slugs", () => {
    const slugs = getStaticToolDirectorySlugs();
    expect(slugs).toContain("image-tools");
    expect(slugs).toContain("image-compressor");
    expect(slugs).not.toContain("image-resizer");
    expect(slugs).not.toContain("image-cropper");
    expect(slugs).not.toContain("image-converter");
    expect(slugs).toHaveLength(TOOL_CATEGORIES.length + 1);
  });

  it("points related tool slugs at catalog entries", () => {
    for (const tool of TOOLS) {
      for (const relatedSlug of tool.relatedTools) {
        expect(getToolBySlug(relatedSlug), `${tool.slug} → ${relatedSlug}`).toBeDefined();
      }
    }
  });
});
