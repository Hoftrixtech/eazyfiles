import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { convertImage } from "@/lib/convert/convert-image";

describe("convertImage", () => {
  let directory: string;
  let jpegPath: string;
  let pngPath: string;
  let jpegBytes: number;
  let pngBytes: number;

  beforeAll(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "convert-test-"));
    jpegPath = path.join(directory, "input.jpg");
    pngPath = path.join(directory, "input.png");

    const jpeg = await sharp({
      create: {
        width: 80,
        height: 40,
        channels: 3,
        background: { r: 20, g: 80, b: 160 },
      },
    })
      .jpeg({ quality: 80 })
      .toBuffer();
    jpegBytes = jpeg.length;
    await writeFile(jpegPath, jpeg);

    const png = await sharp({
      create: {
        width: 80,
        height: 40,
        channels: 4,
        background: { r: 20, g: 80, b: 160, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();
    pngBytes = png.length;
    await writeFile(pngPath, png);
  });

  afterAll(async () => {
    await rm(directory, { recursive: true, force: true }).catch(() => undefined);
  });

  it("converts JPEG to WebP without changing dimensions", async () => {
    const outputPath = path.join(directory, "output.webp");
    const result = await convertImage({
      inputPath: jpegPath,
      outputPath,
      originalBytes: jpegBytes,
      outputFormat: "webp",
      quality: "high",
    });

    expect(result.originalFormat).toBe("jpeg");
    expect(result.outputFormat).toBe("webp");
    expect(result.outputWidth).toBe(80);
    expect(result.outputHeight).toBe(40);

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(80);
    expect(metadata.height).toBe(40);
  });

  it("converts PNG to JPEG and drops transparency", async () => {
    const outputPath = path.join(directory, "output.jpg");
    const result = await convertImage({
      inputPath: pngPath,
      outputPath,
      originalBytes: pngBytes,
      outputFormat: "jpeg",
      quality: "high",
    });

    expect(result.originalFormat).toBe("png");
    expect(result.outputFormat).toBe("jpeg");

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.format).toBe("jpeg");
    expect(metadata.hasAlpha).toBeFalsy();
  });
});
