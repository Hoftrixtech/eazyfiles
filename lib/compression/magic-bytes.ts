import type { SupportedImageFormat } from "@/types/compression";

export function detectImageFormat(buffer: Buffer): SupportedImageFormat | null {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    if (
      buffer.length >= 8 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return "png";
    }
    return null;
  }

  const header = buffer.subarray(0, 12).toString("ascii");
  if (header.startsWith("RIFF") && header.slice(8, 12) === "WEBP") {
    return "webp";
  }

  return null;
}

export function looksLikeHeic(buffer: Buffer): boolean {
  if (buffer.length < 12) {
    return false;
  }

  const brand = buffer.subarray(4, 8).toString("ascii");
  if (brand !== "ftyp") {
    return false;
  }

  const major = buffer.subarray(8, 12).toString("ascii").toLowerCase();
  return ["heic", "heif", "mif1", "msf1", "heix", "hevc"].includes(major);
}
