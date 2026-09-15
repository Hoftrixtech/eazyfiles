import { z } from "zod";
import sharp, { type Metadata } from "sharp";
import {
  MAX_TARGET_BYTES,
  MAX_UPLOAD_BYTES,
  MIN_TARGET_BYTES,
  SUPPORTED_EXTENSIONS,
  SUPPORTED_MIME_TYPES,
} from "@/lib/constants";
import { formatFromExtension, isGenericUploadMime, isPlannedFormat, mimeToFormat, normalizeImageFormat } from "@/lib/compression/formats";
import { detectImageFormat, looksLikeHeic } from "@/lib/compression/magic-bytes";
import { AppError } from "@/lib/errors";
import { getFileExtension } from "@/lib/utils";
import type { OutputFormatOption, SupportedImageFormat } from "@/types/compression";

export const compressFieldsSchema = z.object({
  targetSize: z
    .string()
    .regex(/^\d+$/, "Target size must be a whole number of bytes.")
    .transform((value) => Number.parseInt(value, 10))
    .pipe(
      z
        .number()
        .int()
        .min(MIN_TARGET_BYTES, `Choose a target size of at least ${MIN_TARGET_BYTES / 1024} KB.`)
        .max(MAX_TARGET_BYTES, `Choose a target size of ${MAX_TARGET_BYTES / 1024 / 1024} MB or less.`)
    ),
  targetUnit: z.enum(["B", "KB", "MB"]).optional(),
  outputFormat: z.enum(["original", "jpeg", "png", "webp"]).optional().default("original"),
});

export type CompressFields = z.infer<typeof compressFieldsSchema>;

export function parseCompressFields(raw: {
  targetSize: FormDataEntryValue | null;
  targetUnit: FormDataEntryValue | null;
  outputFormat: FormDataEntryValue | null;
}): CompressFields {
  const parsed = compressFieldsSchema.safeParse({
    targetSize: typeof raw.targetSize === "string" ? raw.targetSize : "",
    targetUnit: typeof raw.targetUnit === "string" && raw.targetUnit.length > 0 ? raw.targetUnit : undefined,
    outputFormat: typeof raw.outputFormat === "string" && raw.outputFormat.length > 0
      ? raw.outputFormat
      : "original",
  });

  if (!parsed.success) {
    throw new AppError(
      "INVALID_TARGET",
      parsed.error.issues[0]?.message ?? "The compression settings are invalid.",
      400
    );
  }

  return parsed.data;
}

export function validateUpload(file: File, contents: Buffer): {
  declaredFormat: SupportedImageFormat;
  detectedFormat: SupportedImageFormat;
} {
  if (file.size <= 0) {
    throw new AppError("INVALID_IMAGE", "The selected file is empty.", 400);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new AppError(
      "FILE_TOO_LARGE",
      `Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
      413
    );
  }

  if (contents.byteLength > MAX_UPLOAD_BYTES) {
    throw new AppError(
      "FILE_TOO_LARGE",
      `Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
      413
    );
  }

  const mime = (file.type || "").toLowerCase();
  const extension = getFileExtension(file.name);
  const genericMime = isGenericUploadMime(mime);

  if (looksLikeHeic(contents) || isPlannedFormat(extension, mime)) {
    throw new AppError(
      "UNSUPPORTED_TYPE",
      "HEIC images are not supported yet. Please convert to JPG, PNG or WebP first.",
      415
    );
  }

  const mimeFormat = genericMime ? null : mimeToFormat(mime);
  const extensionFormat = formatFromExtension(extension);

  if (!genericMime && mime && !SUPPORTED_MIME_TYPES.includes(mime as (typeof SUPPORTED_MIME_TYPES)[number])) {
    throw new AppError(
      "UNSUPPORTED_TYPE",
      "Only JPG, PNG and WebP images are supported.",
      415
    );
  }

  if (extension && !SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    throw new AppError(
      "UNSUPPORTED_TYPE",
      "The file extension is not supported. Use .jpg, .jpeg, .png or .webp.",
      415
    );
  }

  if (mimeFormat && extensionFormat && mimeFormat !== extensionFormat) {
    throw new AppError(
      "UNSUPPORTED_TYPE",
      "The file type and file extension do not match.",
      415
    );
  }

  const detectedFormat = detectImageFormat(contents);
  if (!detectedFormat) {
    throw new AppError(
      "INVALID_IMAGE",
      "This file does not appear to be a valid JPG, PNG or WebP image.",
      422
    );
  }

  const declaredFormat = mimeFormat ?? extensionFormat ?? detectedFormat;
  if (declaredFormat !== detectedFormat) {
    throw new AppError(
      "INVALID_IMAGE",
      "The file contents do not match the declared image type.",
      422
    );
  }

  return { declaredFormat, detectedFormat };
}

export async function assertValidImageContents(
  contents: Buffer,
  expectedFormat: SupportedImageFormat
): Promise<{ width: number; height: number }> {
  let metadata: Metadata;

  try {
    metadata = await sharp(contents, {
      failOn: "truncated",
      limitInputPixels: 40_000_000,
    }).metadata();
  } catch {
    throw new AppError("INVALID_IMAGE", "The file could not be read as a valid image.", 422);
  }

  const format = normalizeImageFormat(metadata.format);

  if (format !== expectedFormat || !metadata.width || !metadata.height) {
    throw new AppError("INVALID_IMAGE", "The file could not be read as a valid image.", 422);
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new AppError(
      "ANIMATED_NOT_SUPPORTED",
      "Animated images are not supported. Please upload a still JPG, PNG or WebP image.",
      415
    );
  }

  return { width: metadata.width, height: metadata.height };
}

export function resolveOutputFormat(
  requested: OutputFormatOption,
  originalFormat: SupportedImageFormat
): SupportedImageFormat {
  return requested === "original" ? originalFormat : requested;
}
