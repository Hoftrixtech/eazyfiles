import { formatFromExtension, isGenericUploadMime, mimeToFormat } from "@/lib/compression/formats";
import { MAX_UPLOAD_BYTES, SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES } from "@/lib/constants";
import { getFileExtension } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";

export function isSupportedImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  const mime = file.type.toLowerCase();
  const mimeOk =
    isGenericUploadMime(mime) ||
    SUPPORTED_MIME_TYPES.includes(mime as (typeof SUPPORTED_MIME_TYPES)[number]);
  const extensionOk =
    !extension || SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number]);
  return mimeOk && extensionOk;
}

export function isOversizedImageFile(file: File): boolean {
  return file.size > MAX_UPLOAD_BYTES;
}

export function guessImageFormat(file: File): SupportedImageFormat | null {
  return mimeToFormat(file.type) ?? formatFromExtension(getFileExtension(file.name));
}

export function preferredConvertTarget(format: SupportedImageFormat): SupportedImageFormat {
  return format === "webp" ? "jpeg" : "webp";
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error("The image does not contain valid dimensions."));
        return;
      }
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be read as an image."));
    };
    image.src = url;
  });
}
