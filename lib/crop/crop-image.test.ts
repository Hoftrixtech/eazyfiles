import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cropImage } from "@/lib/crop/crop-image";
import { AppError } from "@/lib/errors";

describe("cropImage", () => {
  let directory: string;
  let inputPath: string;
  let originalBytes: number;

  beforeAll(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "crop-test-"));
    inputPath = path.join(directory, "input.jpg");
    const buffer = await sharp({
      create: {
        width: 100,
        height: 50,
        channels: 3,
        background: { r: 20, g: 80, b: 160 },
      },
    })
      .jpeg({ quality: 80 })
      .toBuffer();
    originalBytes = buffer.length;
    await writeFile(inputPath, buffer);
  });

  afterAll(async () => {
    await rm(directory, { recursive: true, force: true }).catch(() => undefined);
  });

  it("crops to the requested region and format", async () => {
    const outputPath = path.join(directory, "output.webp");
    const result = await cropImage({
      inputPath,
      outputPath,
      originalBytes,
      crop: { x: 20, y: 10, width: 40, height: 20 },
      outputFormat: "webp",
    });

    expect(result.originalWidth).toBe(100);
    expect(result.originalHeight).toBe(50);
    expect(result.outputWidth).toBe(40);
    expect(result.outputHeight).toBe(20);
    expect(result.outputFormat).toBe("webp");
    expect(result.outputBytes).toBeGreaterThan(0);

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(40);
    expect(metadata.height).toBe(20);
  });

  it("rejects a crop that extends past the image", async () => {
    const outputPath = path.join(directory, "invalid.webp");
    try {
      await cropImage({
        inputPath,
        outputPath,
        originalBytes,
        crop: { x: 80, y: 0, width: 40, height: 20 },
        outputFormat: "webp",
      });
      throw new Error("expected overflow crop to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_CROP");
    }
  });
});
