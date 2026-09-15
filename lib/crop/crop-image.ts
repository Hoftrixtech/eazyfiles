import { writeFile } from "node:fs/promises";
import sharp, { type Metadata, type Sharp } from "sharp";
import { normalizeImageFormat } from "@/lib/compression/formats";
import { isValidCropRegion } from "@/lib/crop/region";
import { AppError } from "@/lib/errors";
import { percentSaved } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";
import type { CropRegion } from "@/types/crop";

export interface CropImageInput {
  inputPath: string;
  outputPath: string;
  originalBytes: number;
  crop: CropRegion;
  outputFormat: SupportedImageFormat;
}

export interface CropImageResult {
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

async function encodeCropped(source: Sharp, format: SupportedImageFormat): Promise<Buffer> {
  let pipeline = source.clone();

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
    throw new AppError("CROP_FAILED", "Cropping failed. Please try again with a different image or crop.", 500);
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

    throw new AppError("CROP_FAILED", "Cropping failed. Please try again with a different image or crop.", 500);
  }
}

export async function cropImage(input: CropImageInput): Promise<CropImageResult> {
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
      "Only JPG, PNG and WebP images can be cropped right now.",
      415
    );
  }

  const crop = {
    x: Math.round(input.crop.x),
    y: Math.round(input.crop.y),
    width: Math.round(input.crop.width),
    height: Math.round(input.crop.height),
  };

  if (!isValidCropRegion(crop, metadata.width, metadata.height)) {
    throw new AppError(
      "INVALID_CROP",
      "The crop area is outside the image or has invalid dimensions.",
      400
    );
  }

  let buffer: Buffer;
  try {
    const extracted = source.extract({
      left: crop.x,
      top: crop.y,
      width: crop.width,
      height: crop.height,
    });
    buffer = await encodeCropped(extracted, input.outputFormat);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("CROP_FAILED", "Cropping failed. Please try again with a different image or crop.", 500);
  }

  const encoded = await assertValidEncodedImage(buffer, input.outputFormat);
  await writeFile(input.outputPath, buffer);

  const outputWidth = encoded.width ?? crop.width;
  const outputHeight = encoded.height ?? crop.height;

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
