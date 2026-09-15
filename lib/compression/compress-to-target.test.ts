import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { compressToTarget } from "./compress-to-target";
import type { SupportedImageFormat } from "@/types/compression";

function fillDeterministicNoise(buffer: Buffer, seed = 1): void {
  let state = seed % 2147483646;
  if (state <= 0) {
    state = 1;
  }

  for (let i = 0; i < buffer.length; i += 1) {
    state = (state * 16807) % 2147483647;
    buffer[i] = state & 255;
  }
}

async function writeNoisyImage(
  filePath: string,
  format: SupportedImageFormat,
  width: number,
  height: number
): Promise<number> {
  const data = Buffer.alloc(width * height * 3);
  fillDeterministicNoise(data);

  const pipeline = sharp(data, { raw: { width, height, channels: 3 } });
  if (format === "jpeg") {
    await pipeline.jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(filePath);
  } else if (format === "webp") {
    await pipeline.webp({ quality: 92 }).toFile(filePath);
  } else {
    await pipeline.png({ compressionLevel: 1 }).toFile(filePath);
  }

  return (await stat(filePath)).size;
}

async function writeSolidJpeg(filePath: string): Promise<number> {
  await sharp({
    create: {
      width: 120,
      height: 80,
      channels: 3,
      background: { r: 32, g: 96, b: 180 },
    },
  })
    .jpeg({ quality: 70 })
    .toFile(filePath);

  return (await stat(filePath)).size;
}

describe("compressToTarget", () => {
  let directory: string;
  let noisyJpegPath: string;
  let noisyJpegBytes: number;
  let smallJpegPath: string;
  let smallJpegBytes: number;
  let noisyPngPath: string;
  let noisyPngBytes: number;

  beforeAll(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "compress-test-"));
    noisyJpegPath = path.join(directory, "noisy.jpg");
    smallJpegPath = path.join(directory, "small.jpg");
    noisyPngPath = path.join(directory, "noisy.png");
    noisyJpegBytes = await writeNoisyImage(noisyJpegPath, "jpeg", 1400, 1000);
    smallJpegBytes = await writeSolidJpeg(smallJpegPath);
    noisyPngBytes = await writeNoisyImage(noisyPngPath, "png", 480, 360);
  });

  afterAll(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  async function run(options: {
    inputPath: string;
    originalBytes: number;
    targetBytes: number;
    outputFormat: SupportedImageFormat;
    name: string;
  }) {
    const extension = options.outputFormat === "jpeg" ? "jpg" : options.outputFormat;
    const outputPath = path.join(directory, `${options.name}.${extension}`);
    const result = await compressToTarget({
      inputPath: options.inputPath,
      outputPath,
      originalBytes: options.originalBytes,
      targetBytes: options.targetBytes,
      outputFormat: options.outputFormat,
    });
    const output = await readFile(outputPath);
    const metadata = await sharp(output).metadata();

    expect(output.length).toBe(result.compressedBytes);
    expect(metadata.width).toBeGreaterThan(1);
    expect(metadata.height).toBeGreaterThan(1);

    return { result, output, metadata };
  }

  it("meets a 500 KB target without overshooting and stays close to the target", async () => {
    expect(noisyJpegBytes).toBeGreaterThan(500 * 1024);

    const { result, metadata } = await run({
      inputPath: noisyJpegPath,
      originalBytes: noisyJpegBytes,
      targetBytes: 500 * 1024,
      outputFormat: "jpeg",
      name: "out-500kb",
    });

    expect(result.skipped).toBe(false);
    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBeLessThanOrEqual(500 * 1024);
    expect(result.compressedBytes).toBeGreaterThanOrEqual(Math.round(500 * 1024 * 0.85));
    expect(metadata.format).toBe("jpeg");
  });

  it("meets a 200 KB target without overshooting and stays close to the target", async () => {
    const { result } = await run({
      inputPath: noisyJpegPath,
      originalBytes: noisyJpegBytes,
      targetBytes: 200 * 1024,
      outputFormat: "jpeg",
      name: "out-200kb",
    });

    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBeLessThanOrEqual(200 * 1024);
    expect(result.compressedBytes).toBeGreaterThanOrEqual(Math.round(200 * 1024 * 0.85));
  });

  it("meets a 100 KB target without overshooting and stays close to the target", async () => {
    const { result } = await run({
      inputPath: noisyJpegPath,
      originalBytes: noisyJpegBytes,
      targetBytes: 100 * 1024,
      outputFormat: "jpeg",
      name: "out-100kb",
    });

    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBeLessThanOrEqual(100 * 1024);
    expect(result.compressedBytes).toBeGreaterThanOrEqual(Math.round(100 * 1024 * 0.85));
  });

  it("returns the original file when it is already below the target", async () => {
    expect(smallJpegBytes).toBeLessThan(50 * 1024);

    const { result, output } = await run({
      inputPath: smallJpegPath,
      originalBytes: smallJpegBytes,
      targetBytes: 100 * 1024,
      outputFormat: "jpeg",
      name: "out-already-small",
    });
    const original = await readFile(smallJpegPath);

    expect(result.skipped).toBe(true);
    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBe(smallJpegBytes);
    expect(result.compressionPercentage).toBe(0);
    expect(Buffer.compare(output, original)).toBe(0);
  });

  it("returns a valid image for a very small target without exceeding it when possible", async () => {
    const targetBytes = 10 * 1024;
    const { result, metadata } = await run({
      inputPath: noisyJpegPath,
      originalBytes: noisyJpegBytes,
      targetBytes,
      outputFormat: "jpeg",
      name: "out-tiny",
    });

    expect(metadata.format).toBe("jpeg");
    expect(result.skipped).toBe(false);
    if (result.targetMet) {
      expect(result.compressedBytes).toBeLessThanOrEqual(targetBytes);
    } else {
      expect(result.compressedBytes).toBeGreaterThan(targetBytes);
    }
  });

  it("compresses to WebP without exceeding the target", async () => {
    const { result, metadata } = await run({
      inputPath: noisyJpegPath,
      originalBytes: noisyJpegBytes,
      targetBytes: 200 * 1024,
      outputFormat: "webp",
      name: "out-webp",
    });

    expect(metadata.format).toBe("webp");
    expect(result.outputFormat).toBe("webp");
    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBeLessThanOrEqual(200 * 1024);
    expect(result.compressedBytes).toBeGreaterThanOrEqual(Math.round(200 * 1024 * 0.8));
  });

  it("keeps PNG output as PNG and does not silently convert the format", { timeout: 90_000 }, async () => {
    const { result, metadata } = await run({
      inputPath: noisyPngPath,
      originalBytes: noisyPngBytes,
      targetBytes: 150 * 1024,
      outputFormat: "png",
      name: "out-png",
    });

    expect(metadata.format).toBe("png");
    expect(result.outputFormat).toBe("png");
    expect(result.compressedBytes).toBeLessThanOrEqual(150 * 1024);
  });

  it("can convert PNG to JPEG when that output format is requested", async () => {
    const { result, metadata } = await run({
      inputPath: noisyPngPath,
      originalBytes: noisyPngBytes,
      targetBytes: 80 * 1024,
      outputFormat: "jpeg",
      name: "out-png-to-jpeg",
    });

    expect(metadata.format).toBe("jpeg");
    expect(result.outputFormat).toBe("jpeg");
    expect(result.originalFormat).toBe("png");
    expect(result.targetMet).toBe(true);
    expect(result.compressedBytes).toBeLessThanOrEqual(80 * 1024);
  });

  it("never returns a file larger than the target when a fit is found", async () => {
    const targets = [100 * 1024, 200 * 1024, 500 * 1024];

    for (const targetBytes of targets) {
      const outputPath = path.join(directory, `cap-${targetBytes}.jpg`);
      const result = await compressToTarget({
        inputPath: noisyJpegPath,
        outputPath,
        originalBytes: noisyJpegBytes,
        targetBytes,
        outputFormat: "jpeg",
      });
      const output = await readFile(outputPath);

      expect(result.targetMet).toBe(true);
      expect(output.length).toBeLessThanOrEqual(targetBytes);
    }
  });
});
