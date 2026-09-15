import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { resizeImage } from "@/lib/resize/resize-image";

describe("resizeImage", () => {
  let directory: string;
  let inputPath: string;
  let originalBytes: number;

  beforeAll(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "resize-test-"));
    inputPath = path.join(directory, "input.jpg");
    const buffer = await sharp({
      create: {
        width: 400,
        height: 200,
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

  it("resizes to the requested dimensions and format", async () => {
    const outputPath = path.join(directory, "output.webp");
    const result = await resizeImage({
      inputPath,
      outputPath,
      originalBytes,
      width: 200,
      height: 100,
      outputFormat: "webp",
    });

    expect(result.outputWidth).toBe(200);
    expect(result.outputHeight).toBe(100);
    expect(result.outputFormat).toBe("webp");
    expect(result.outputBytes).toBeGreaterThan(0);

    const metadata = await sharp(outputPath).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(200);
    expect(metadata.height).toBe(100);
  });
});
