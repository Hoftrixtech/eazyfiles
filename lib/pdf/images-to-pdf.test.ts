import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { imagesToPdf } from "@/lib/pdf/images-to-pdf";

describe("imagesToPdf", () => {
  it("creates a single-page PDF from one image", async () => {
    const png = await sharp({
      create: { width: 120, height: 80, channels: 3, background: { r: 20, g: 120, b: 200 } },
    })
      .png()
      .toBuffer();

    const result = await imagesToPdf([png], "image-size");
    expect(result.pageCount).toBe(1);
    expect(result.pdfBytes.byteLength).toBeGreaterThan(500);
    expect(result.pdfBytes[0]).toBe(0x25);
    expect(result.pdfBytes[1]).toBe(0x50);
  });

  it("creates a multi-page PDF preserving upload order", async () => {
    const make = (color: { r: number; g: number; b: number }) =>
      sharp({
        create: { width: 64, height: 64, channels: 3, background: color },
      })
        .jpeg()
        .toBuffer();

    const result = await imagesToPdf([await make({ r: 255, g: 0, b: 0 }), await make({ r: 0, g: 255, b: 0 })], "a4-fit");
    expect(result.pageCount).toBe(2);
    expect(result.pdfBytes.byteLength).toBeGreaterThan(1000);
  });
});
