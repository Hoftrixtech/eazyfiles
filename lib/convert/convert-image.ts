import { writeFile } from "node:fs/promises";
import sharp, { type Metadata, type Sharp } from "sharp";
import { normalizeImageFormat } from "@/lib/compression/formats";
import { AppError } from "@/lib/errors";
import { isAllowedResizeSize } from "@/lib/resize/dimensions";
import { percentSaved } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";
import type { ConvertQuality } from "@/types/convert";

export interface ConvertImageInput {
  inputPath: string;
  outputPath: string;
  originalBytes: number;
  outputFormat: SupportedImageFormat;
  quality: ConvertQuality;
}

export interface ConvertImageResult {
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  originalFormat: SupportedImageFormat;
  outputFormat: SupportedImageFormat;
  outputBytes: number;
  sizeDeltaPercent: number;
  quality: ConvertQuality;
}

const JPEG_QUALITY: Record<ConvertQuality, number> = {
  high: 92,
  balanced: 82,
  smaller: 70,
};

const WEBP_QUALITY: Record<ConvertQuality, number> = {
  high: 90,
  balanced: 80,
  smaller: 68,
};

const PNG_COMPRESSION: Record<ConvertQuality, number> = {
  high: 6,
  balanced: 9,
  smaller: 9,
};

function createPipeline(inputPath: string): Sharp {
  return sharp(inputPath, {
    failOn: "truncated",
    sequentialRead: true,
    limitInputPixels: 40_000_000,
  }).rotate();
}

async function encodeConverted(
  source: Sharp,
  format: SupportedImageFormat,
  quality: ConvertQuality
): Promise<Buffer> {
  let pipeline = source.clone();

  if (format === "jpeg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
    return pipeline
      .jpeg({
        quality: JPEG_QUALITY[quality],
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();
  }

  if (format === "webp") {
    return pipeline
      .webp({
        quality: WEBP_QUALITY[quality],
        alphaQuality: WEBP_QUALITY[quality],
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();
  }

  return pipeline
    .png({
      compressionLevel: PNG_COMPRESSION[quality],
      adaptiveFiltering: true,
      effort: 4,
    })
    .toBuffer();
}

async function assertValidEncodedImage(buffer: Buffer, expectedFormat: SupportedImageFormat): Promise<Metadata> {
  if (buffer.length < 24) {
    throw new AppError(
      "CONVERSION_FAILED",
      "Conversion failed. Please try again with a different image or format.",
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
    return metadata;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "CONVERSION_FAILED",
      "Conversion failed. Please try again with a different image or format.",
      500
    );
  }
}

export async function convertImage(input: ConvertImageInput): Promise<ConvertImageResult> {
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

  if (!isAllowedResizeSize(metadata.width, metadata.height)) {
    throw new AppError(
      "INVALID_DIMENSIONS",
      "This image is too large to convert. Please use a smaller image.",
      400
    );
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
      "Only JPG, PNG and WebP images can be converted right now.",
      415
    );
  }

  let buffer: Buffer;
  try {
    buffer = await encodeConverted(source, input.outputFormat, input.quality);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "CONVERSION_FAILED",
      "Conversion failed. Please try again with a different image or format.",
      500
    );
  }

  const encoded = await assertValidEncodedImage(buffer, input.outputFormat);
  await writeFile(input.outputPath, buffer);

  return {
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    outputWidth: encoded.width ?? metadata.width,
    outputHeight: encoded.height ?? metadata.height,
    originalFormat,
    outputFormat: input.outputFormat,
    outputBytes: buffer.length,
    sizeDeltaPercent: percentSaved(input.originalBytes, buffer.length),
    quality: input.quality,
  };
}
