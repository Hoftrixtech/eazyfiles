import { writeFile } from "node:fs/promises";
import sharp, { type Metadata, type Sharp } from "sharp";
import { normalizeImageFormat } from "@/lib/compression/formats";
import { AppError } from "@/lib/errors";
import { isAllowedResizeSize } from "@/lib/resize/dimensions";
import { percentSaved } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";

export interface ResizeImageInput {
  inputPath: string;
  outputPath: string;
  originalBytes: number;
  width: number;
  height: number;
  outputFormat: SupportedImageFormat;
}

export interface ResizeImageResult {
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  originalFormat: SupportedImageFormat;
  outputFormat: SupportedImageFormat;
  outputBytes: number;
  sizeDeltaPercent: number;
}

function createPipeline(inputPath: string): Sharp {
  return sharp(inputPath, {
    failOn: "truncated",
    sequentialRead: true,
    limitInputPixels: 40_000_000,
  }).rotate();
}

async function encodeResized(
  source: Sharp,
  format: SupportedImageFormat,
  width: number,
  height: number
): Promise<Buffer> {
  let pipeline = source.clone().resize(width, height, {
    fit: "fill",
    kernel: "lanczos3",
  });

  if (format === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
    return pipeline
      .jpeg({
        quality: 90,
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();
  }

  if (format === "webp") {
    return pipeline
      .webp({
        quality: 90,
        alphaQuality: 90,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();
  }

  return pipeline
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      effort: 4,
    })
    .toBuffer();
}

async function assertValidEncodedImage(buffer: Buffer, expectedFormat: SupportedImageFormat): Promise<Metadata> {
  if (buffer.length < 24) {
    throw new AppError("RESIZE_FAILED", "Resizing failed. Please try again with a different image or size.", 500);
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
    return metadata;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("RESIZE_FAILED", "Resizing failed. Please try again with a different image or size.", 500);
  }
}

export async function resizeImage(input: ResizeImageInput): Promise<ResizeImageResult> {
  if (!isAllowedResizeSize(input.width, input.height)) {
    throw new AppError("INVALID_DIMENSIONS", "Enter a valid width and height.", 400);
  }

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
      "Only JPG, PNG and WebP images can be resized right now.",
      415
    );
  }

  const buffer = await encodeResized(source, input.outputFormat, input.width, input.height);
  const encoded = await assertValidEncodedImage(buffer, input.outputFormat);
  await writeFile(input.outputPath, buffer);

  const outputWidth = encoded.width ?? input.width;
  const outputHeight = encoded.height ?? input.height;

  return {
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    outputWidth,
    outputHeight,
    originalFormat,
    outputFormat: input.outputFormat,
    outputBytes: buffer.length,
    sizeDeltaPercent: percentSaved(input.originalBytes, buffer.length),
  };
}
