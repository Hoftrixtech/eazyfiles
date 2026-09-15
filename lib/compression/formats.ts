import type { SupportedImageFormat } from "@/types/compression";

export const MIME_TO_FORMAT: Record<string, SupportedImageFormat> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

export const FORMAT_TO_MIME: Record<SupportedImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const FORMAT_TO_EXTENSION: Record<SupportedImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

export const PLANNED_FORMATS = ["heic", "heif"] as const;

export function isGenericUploadMime(mime: string): boolean {
  const normalized = mime.trim().toLowerCase();
  return normalized === "" || normalized === "application/octet-stream" || normalized === "binary/octet-stream";
}

export function normalizeImageFormat(format: string | undefined): SupportedImageFormat | null {
  if (format === "jpeg" || format === "jpg") {
    return "jpeg";
  }
  if (format === "png") {
    return "png";
  }
  if (format === "webp") {
    return "webp";
  }
  return null;
}

export function mimeToFormat(mime: string): SupportedImageFormat | null {
  return MIME_TO_FORMAT[mime.toLowerCase()] ?? null;
}

export function formatFromExtension(extension: string): SupportedImageFormat | null {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  if (normalized === "jpg" || normalized === "jpeg") {
    return "jpeg";
  }
  if (normalized === "png") {
    return "png";
  }
  if (normalized === "webp") {
    return "webp";
  }
  return null;
}

export function isPlannedFormat(extension: string, mime: string): boolean {
  const ext = extension.toLowerCase().replace(/^\./, "");
  const type = mime.toLowerCase();
  return (
    PLANNED_FORMATS.includes(ext as (typeof PLANNED_FORMATS)[number]) ||
    type === "image/heic" ||
    type === "image/heif"
  );
}
