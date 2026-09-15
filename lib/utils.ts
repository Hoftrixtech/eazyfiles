export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  if (bytes % (1024 * 1024) === 0) {
    return `${bytes / (1024 * 1024)} MB`;
  }

  if (bytes % 1024 === 0 && bytes < 1024 * 1024) {
    return `${bytes / 1024} KB`;
  }

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return kilobytes >= 100 ? `${Math.round(kilobytes)} KB` : `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes = kilobytes / 1024;
  return megabytes >= 100 ? `${Math.round(megabytes)} MB` : `${megabytes.toFixed(2)} MB`;
}

export function percentSaved(originalBytes: number, compressedBytes: number): number {
  if (originalBytes <= 0) {
    return 0;
  }

  return Number((((originalBytes - compressedBytes) / originalBytes) * 100).toFixed(1));
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`;
}

export function getFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return "";
  }

  return trimmed.slice(lastDot + 1).toLowerCase();
}

export function sanitizeDownloadBase(filename: string): string {
  const baseName = filename.replace(/\\/g, "/").split("/").pop() ?? "image";
  const withoutExt = baseName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExt.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "").replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 80) || "image";
}

export function sanitizeStoredFileName(filename: string): string {
  const baseName = filename.replace(/\\/g, "/").split("/").pop() ?? "image";
  const cleaned = baseName.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 120) || "image";
}
