import { copyFile, writeFile } from "node:fs/promises";
import sharp, { type Metadata, type Sharp } from "sharp";
import { normalizeImageFormat } from "@/lib/compression/formats";
import { AppError } from "@/lib/errors";
import { percentSaved } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";

export interface CompressToTargetInput {
  inputPath: string;
  outputPath: string;
  originalBytes: number;
  targetBytes: number;
  outputFormat: SupportedImageFormat;
}

export interface CompressToTargetResult {
  compressedBytes: number;
  originalFormat: SupportedImageFormat;
  outputFormat: SupportedImageFormat;
  width: number;
  height: number;
  targetMet: boolean;
  compressionPercentage: number;
  skipped: boolean;
  quality: number | null;
}

interface EncodeCandidate {
  buffer: Buffer;
  quality: number;
  width: number;
  height: number;
}

const MIN_QUALITY = 1;
const MAX_QUALITY = 100;
const MAX_QUALITY_ITERATIONS = 9;
const MAX_SCALE_ITERATIONS = 6;
const MIN_EDGE = 64;
const MAX_INPUT_EDGE = 8192;
/** Cap pixels used during quality search (large uploads are downscaled for speed). */
const MAX_SEARCH_PIXELS = 4_000_000;

function createPipeline(inputPath: string): Sharp {
  return sharp(inputPath, {
    failOn: "truncated",
    sequentialRead: true,
    limitInputPixels: 40_000_000,
  }).rotate();
}

async function encodeBuffer(
  source: Sharp,
  format: SupportedImageFormat,
  quality: number,
  width: number,
  height: number,
  pngPalette = false
): Promise<Buffer> {
  let pipeline = source.clone().resize(width, height, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const clampedQuality = Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, Math.round(quality)));

  if (format === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
    return pipeline
      .jpeg({
        quality: clampedQuality,
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();
  }

  if (format === "webp") {
    return pipeline
      .webp({
        quality: clampedQuality,
        alphaQuality: clampedQuality,
        effort: 2,
        smartSubsample: true,
      })
      .toBuffer();
  }

  return pipeline
    .png({
      compressionLevel: pngPalette ? 9 : 6,
      adaptiveFiltering: true,
      palette: pngPalette,
      quality: pngPalette ? clampedQuality : 100,
      effort: 2,
    })
    .toBuffer();
}

function chooseBetter(
  current: EncodeCandidate | null,
  next: EncodeCandidate,
  targetBytes: number
): EncodeCandidate {
  const nextFits = next.buffer.length <= targetBytes;
  const currentFits = current !== null && current.buffer.length <= targetBytes;

  if (nextFits && !currentFits) {
    return next;
  }

  if (!nextFits && currentFits) {
    return current;
  }

  if (nextFits && currentFits) {
    if (next.buffer.length !== current.buffer.length) {
      return next.buffer.length > current.buffer.length ? next : current;
    }
    return next.quality >= current.quality ? next : current;
  }

  if (!current) {
    return next;
  }

  return next.buffer.length < current.buffer.length ? next : current;
}

async function searchLossyQuality(
  source: Sharp,
  format: Exclude<SupportedImageFormat, "png">,
  targetBytes: number,
  width: number,
  height: number
): Promise<EncodeCandidate | null> {
  const maxQualityBuffer = await encodeBuffer(source, format, MAX_QUALITY, width, height);
  if (maxQualityBuffer.length <= targetBytes) {
    return { buffer: maxQualityBuffer, quality: MAX_QUALITY, width, height };
  }

  let low = MIN_QUALITY;
  let high = MAX_QUALITY - 1;
  let best: EncodeCandidate | null = null;
  let iterations = 0;

  while (low <= high && iterations < MAX_QUALITY_ITERATIONS) {
    const mid = Math.floor((low + high) / 2);
    const buffer = await encodeBuffer(source, format, mid, width, height);
    const candidate = { buffer, quality: mid, width, height };

    if (buffer.length <= targetBytes) {
      best = chooseBetter(best, candidate, targetBytes);
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    iterations += 1;
  }

  if (best && best.quality < MAX_QUALITY) {
    const refine = best.quality + 1;
    const buffer = await encodeBuffer(source, format, refine, width, height);
    best = chooseBetter(best, { buffer, quality: refine, width, height }, targetBytes);
  }

  return best && best.buffer.length <= targetBytes ? best : null;
}

async function searchPng(
  source: Sharp,
  targetBytes: number,
  width: number,
  height: number
): Promise<EncodeCandidate | null> {
  const lossless = await encodeBuffer(source, "png", MAX_QUALITY, width, height, false);
  if (lossless.length <= targetBytes) {
    return { buffer: lossless, quality: MAX_QUALITY, width, height };
  }

  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  let best: EncodeCandidate | null = null;
  let iterations = 0;

  while (low <= high && iterations < MAX_QUALITY_ITERATIONS) {
    const mid = Math.floor((low + high) / 2);
    const buffer = await encodeBuffer(source, "png", mid, width, height, true);
    const candidate = { buffer, quality: mid, width, height };

    if (buffer.length <= targetBytes) {
      best = chooseBetter(best, candidate, targetBytes);
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    iterations += 1;
  }

  return best && best.buffer.length <= targetBytes ? best : null;
}

async function searchQuality(
  source: Sharp,
  format: SupportedImageFormat,
  targetBytes: number,
  width: number,
  height: number
): Promise<EncodeCandidate | null> {
  if (format === "png") {
    return searchPng(source, targetBytes, width, height);
  }

  return searchLossyQuality(source, format, targetBytes, width, height);
}

async function searchByScale(
  source: Sharp,
  format: SupportedImageFormat,
  targetBytes: number,
  width: number,
  height: number
): Promise<EncodeCandidate | null> {
  const minScale = Math.min(1, MIN_EDGE / Math.max(width, height));
  let low = minScale;
  let high = 1;
  let best: EncodeCandidate | null = null;
  let iterations = 0;

  while (high - low > 0.03 && iterations < MAX_SCALE_ITERATIONS) {
    const mid = (low + high) / 2;
    const scaledWidth = Math.max(MIN_EDGE, Math.round(width * mid));
    const scaledHeight = Math.max(MIN_EDGE, Math.round(height * mid));
    const found = await searchQuality(source, format, targetBytes, scaledWidth, scaledHeight);

    if (found) {
      best = chooseBetter(best, found, targetBytes);
      low = mid;
    } else {
      high = mid;
    }

    iterations += 1;
  }

  const finalWidth = Math.max(MIN_EDGE, Math.round(width * low));
  const finalHeight = Math.max(MIN_EDGE, Math.round(height * low));
  const refined = await searchQuality(source, format, targetBytes, finalWidth, finalHeight);
  if (refined) {
    best = chooseBetter(best, refined, targetBytes);
  }

  return best && best.buffer.length <= targetBytes ? best : null;
}

async function bestEffortEncode(
  source: Sharp,
  format: SupportedImageFormat,
  width: number,
  height: number
): Promise<EncodeCandidate> {
  const minWidth = Math.max(MIN_EDGE, Math.round(width * 0.25));
  const minHeight = Math.max(MIN_EDGE, Math.round(height * 0.25));
  const usePalette = format === "png";
  const buffer = await encodeBuffer(source, format, MIN_QUALITY, minWidth, minHeight, usePalette);
  return { buffer, quality: MIN_QUALITY, width: minWidth, height: minHeight };
}

async function assertValidEncodedImage(buffer: Buffer, expectedFormat: SupportedImageFormat): Promise<void> {
  if (buffer.length < 24) {
    throw new AppError(
      "COMPRESSION_FAILED",
      "Compression failed. Please try again with a different image or target size.",
      500
    );
  }

  try {
    const metadata = await sharp(buffer, {
      failOn: "truncated",
      limitInputPixels: 40_000_000,
    }).metadata();
    const format = normalizeImageFormat(metadata.format);
    if (format !== expectedFormat || !metadata.width || !metadata.height) {
      throw new Error("invalid output");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "COMPRESSION_FAILED",
      "Compression failed. Please try again with a different image or target size.",
      500
    );
  }
}

function toResult(
  input: CompressToTargetInput,
  originalFormat: SupportedImageFormat,
  candidate: EncodeCandidate,
  skipped: boolean
): CompressToTargetResult {
  return {
    compressedBytes: candidate.buffer.length,
    originalFormat,
    outputFormat: input.outputFormat,
    width: candidate.width,
    height: candidate.height,
    targetMet: candidate.buffer.length <= input.targetBytes,
    compressionPercentage: percentSaved(input.originalBytes, candidate.buffer.length),
    skipped,
    quality: candidate.quality,
  };
}

export async function compressToTarget(input: CompressToTargetInput): Promise<CompressToTargetResult> {
  let source: Sharp;

  try {
    source = createPipeline(input.inputPath);
  } catch {
    throw new AppError("INVALID_IMAGE", "The file could not be read as a valid image.", 422);
  }

  let metadata: Metadata;
  try {
    metadata = await source.metadata();
  } catch {
    throw new AppError("INVALID_IMAGE", "The file could not be read as a valid image.", 422);
  }

  if (!metadata.width || !metadata.height) {
    throw new AppError("INVALID_IMAGE", "The image does not contain valid dimensions.", 422);
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new AppError(
      "ANIMATED_NOT_SUPPORTED",
      "Animated images are not supported. Please upload a still JPG, PNG or WebP image.",
      415
    );
  }

  const originalFormat = normalizeImageFormat(metadata.format);
  if (!originalFormat) {
    throw new AppError(
      "UNSUPPORTED_TYPE",
      "Only JPG, PNG and WebP images can be compressed right now.",
      415
    );
  }

  if (input.originalBytes <= input.targetBytes && input.outputFormat === originalFormat) {
    await copyFile(input.inputPath, input.outputPath);
    return {
      compressedBytes: input.originalBytes,
      originalFormat,
      outputFormat: input.outputFormat,
      width: metadata.width,
      height: metadata.height,
      targetMet: true,
      compressionPercentage: 0,
      skipped: true,
      quality: null,
    };
  }

  let width = metadata.width;
  let height = metadata.height;
  const longestEdge = Math.max(width, height);

  if (longestEdge > MAX_INPUT_EDGE) {
    const scale = MAX_INPUT_EDGE / longestEdge;
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const searchPixels = width * height;
  if (searchPixels > MAX_SEARCH_PIXELS) {
    const scale = Math.sqrt(MAX_SEARCH_PIXELS / searchPixels);
    width = Math.max(MIN_EDGE, Math.round(width * scale));
    height = Math.max(MIN_EDGE, Math.round(height * scale));
  }

  let best = await searchQuality(source, input.outputFormat, input.targetBytes, width, height);

  if (!best) {
    best = await searchByScale(source, input.outputFormat, input.targetBytes, width, height);
  }

  if (!best) {
    best = await bestEffortEncode(source, input.outputFormat, width, height);
  }

  await assertValidEncodedImage(best.buffer, input.outputFormat);
  await writeFile(input.outputPath, best.buffer);
  return toResult(input, originalFormat, best, false);
}
