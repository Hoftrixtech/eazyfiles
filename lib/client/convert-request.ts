import { throwFromApiPayload } from "@/lib/client/api-error";
import { SESSION_HEADER_NAME } from "@/lib/constants";
import { FORMAT_TO_MIME } from "@/lib/compression/formats";
import { getAnonymousSessionId, persistAnonymousSessionId } from "@/lib/client/session";
import type { SupportedImageFormat } from "@/types/compression";

export interface ConvertClientResult {
  blob: Blob;
  objectUrl: string;
  filename: string;
  originalSize: number;
  outputSize: number;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  originalFormat: string;
  outputFormat: string;
  sizeDeltaPercent: number;
}

function safeDownloadName(value: string): string {
  return value.replace(/[\\/]+/g, "").replace(/[\r\n"]/g, "").slice(0, 120) || "converted-image";
}

function filenameFromDisposition(header: string | null): string {
  if (!header) {
    return "converted-image";
  }

  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    try {
      return safeDownloadName(decodeURIComponent(utfMatch[1]));
    } catch {
      return safeDownloadName(utfMatch[1]);
    }
  }

  const asciiMatch = /filename="([^"]+)"/i.exec(header);
  return safeDownloadName(asciiMatch?.[1] ?? "converted-image");
}

function mimeForOutput(format: string): string {
  if (format === "png" || format === "webp" || format === "jpeg") {
    return FORMAT_TO_MIME[format satisfies SupportedImageFormat];
  }

  return FORMAT_TO_MIME.jpeg;
}

function typedImageBlob(blob: Blob, format: string): Blob {
  if (blob.type.startsWith("image/")) {
    return blob;
  }

  return new Blob([blob], { type: mimeForOutput(format) });
}

export async function convertImageRequest(input: {
  file: File;
  outputFormat: string;
  quality: string;
}): Promise<ConvertClientResult> {
  const body = new FormData();
  body.append("file", input.file);
  body.append("outputFormat", input.outputFormat);
  body.append("quality", input.quality);

  const sessionId = getAnonymousSessionId();

  let response: Response;
  try {
    response = await fetch("/api/image-converter", {
      method: "POST",
      body,
      credentials: "same-origin",
      headers: sessionId ? { [SESSION_HEADER_NAME]: sessionId } : undefined,
    });
  } catch {
    throw new Error("We could not reach the conversion service. Check your connection and try again.");
  }

  const returnedSession = response.headers.get("X-Session-Id");
  if (returnedSession) {
    persistAnonymousSessionId(returnedSession);
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throwFromApiPayload(payload, "Conversion failed. Please try a different image or format.");
  }

  const blob = await response.blob();
  const outputFormat = response.headers.get("X-Output-Format") ?? input.outputFormat;
  const originalFormat = response.headers.get("X-Original-Format") ?? "";
  const typedBlob = typedImageBlob(blob, outputFormat);
  const originalSize = Number(response.headers.get("X-Original-Size") ?? input.file.size);
  const outputSize = Number(response.headers.get("X-Output-Size") ?? typedBlob.size);
  const originalWidth = Number(response.headers.get("X-Original-Width") ?? 0);
  const originalHeight = Number(response.headers.get("X-Original-Height") ?? 0);
  const outputWidth = Number(response.headers.get("X-Output-Width") ?? originalWidth);
  const outputHeight = Number(response.headers.get("X-Output-Height") ?? originalHeight);
  const sizeDeltaPercent = Number(response.headers.get("X-Size-Delta-Percent") ?? 0);

  return {
    blob: typedBlob,
    objectUrl: URL.createObjectURL(typedBlob),
    filename: filenameFromDisposition(response.headers.get("Content-Disposition")),
    originalSize: Number.isFinite(originalSize) ? originalSize : input.file.size,
    outputSize: Number.isFinite(outputSize) ? outputSize : typedBlob.size,
    originalWidth: Number.isFinite(originalWidth) ? originalWidth : 0,
    originalHeight: Number.isFinite(originalHeight) ? originalHeight : 0,
    outputWidth: Number.isFinite(outputWidth) ? outputWidth : 0,
    outputHeight: Number.isFinite(outputHeight) ? outputHeight : 0,
    originalFormat,
    outputFormat,
    sizeDeltaPercent: Number.isFinite(sizeDeltaPercent) ? sizeDeltaPercent : 0,
  };
}
