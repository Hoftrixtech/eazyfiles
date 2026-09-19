import { throwFromApiPayload } from "@/lib/client/api-error";
import { SESSION_HEADER_NAME } from "@/lib/constants";
import { FORMAT_TO_MIME } from "@/lib/compression/formats";
import { getAnonymousSessionId, persistAnonymousSessionId } from "@/lib/client/session";
import type { SupportedImageFormat } from "@/types/compression";

export interface CompressClientResult {
  blob: Blob;
  objectUrl: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  outputFormat: string;
  targetSize: number;
  targetMet: boolean;
  skipped: boolean;
}

function safeDownloadName(value: string): string {
  return value.replace(/[\\/]+/g, "").replace(/[\r\n"]/g, "").slice(0, 120) || "compressed-image";
}

function filenameFromDisposition(header: string | null): string {
  if (!header) {
    return "compressed-image";
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
  return safeDownloadName(asciiMatch?.[1] ?? "compressed-image");
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

function parseJsonError(blob: Blob): Promise<unknown> {
  return blob.text().then((text) => {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  });
}

function compressWithProgress(
  body: FormData,
  sessionId: string | null,
  onProgress: (percent: number) => void
): Promise<{ response: XMLHttpRequest; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let simulated = 8;
    let processingTimer: ReturnType<typeof setInterval> | null = null;

    const stopSimulation = () => {
      if (processingTimer) {
        clearInterval(processingTimer);
        processingTimer = null;
      }
    };

    const startSimulation = () => {
      stopSimulation();
      processingTimer = setInterval(() => {
        simulated = Math.min(simulated + 3, 90);
        onProgress(simulated);
      }, 180);
    };

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && event.total > 0) {
        const uploadShare = Math.round((event.loaded / event.total) * 45);
        simulated = Math.max(simulated, uploadShare);
        onProgress(simulated);
      }
    });

    xhr.upload.addEventListener("loadend", () => {
      simulated = Math.max(simulated, 48);
      onProgress(simulated);
      startSimulation();
    });

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        simulated = Math.max(simulated, 92);
        onProgress(simulated);
      }
    });

    xhr.onload = () => {
      stopSimulation();
      onProgress(100);
      const blob = xhr.response instanceof Blob ? xhr.response : new Blob();
      resolve({ response: xhr, blob });
    };

    xhr.onerror = () => {
      stopSimulation();
      reject(new Error("We could not reach the compression service. Check your connection and try again."));
    };

    xhr.ontimeout = () => {
      stopSimulation();
      reject(new Error("Compression took too long. Try a smaller image or a higher target size."));
    };

    xhr.onabort = () => {
      stopSimulation();
      reject(new Error("Compression was cancelled."));
    };

    xhr.open("POST", "/api/compress");
    xhr.timeout = 120_000;
    xhr.withCredentials = true;
    xhr.responseType = "blob";
    if (sessionId) {
      xhr.setRequestHeader(SESSION_HEADER_NAME, sessionId);
    }

    onProgress(5);
    xhr.send(body);
  });
}

export async function compressImageRequest(input: {
  file: File;
  targetSize: number;
  outputFormat: string;
  onProgress?: (percent: number) => void;
}): Promise<CompressClientResult> {
  const body = new FormData();
  body.append("file", input.file);
  body.append("targetSize", String(input.targetSize));
  body.append("outputFormat", input.outputFormat);

  const sessionId = getAnonymousSessionId();
  const report = (value: number) => input.onProgress?.(value);

  let response: XMLHttpRequest;
  let blob: Blob;

  try {
    const result = await compressWithProgress(body, sessionId, report);
    response = result.response;
    blob = result.blob;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Compression failed. Please try again.";
    throw new Error(message);
  }

  const returnedSession = response.getResponseHeader("X-Session-Id");
  if (returnedSession) {
    persistAnonymousSessionId(returnedSession);
  }

  if (response.status < 200 || response.status >= 300) {
    const payload = await parseJsonError(blob);
    throwFromApiPayload(payload, "Compression failed. Please try a different image or target size.");
  }

  const originalSize = Number(response.getResponseHeader("X-Original-Size") ?? input.file.size);
  const compressedSize = Number(response.getResponseHeader("X-Compressed-Size") ?? blob.size);
  const savedPercent = Number(response.getResponseHeader("X-Saved-Percent") ?? 0);
  const targetSize = Number(response.getResponseHeader("X-Target-Size") ?? input.targetSize);
  const outputFormat = response.getResponseHeader("X-Output-Format") ?? "jpeg";
  const typedBlob = typedImageBlob(blob, outputFormat);

  return {
    blob: typedBlob,
    objectUrl: URL.createObjectURL(typedBlob),
    filename: filenameFromDisposition(response.getResponseHeader("Content-Disposition")),
    originalSize: Number.isFinite(originalSize) ? originalSize : input.file.size,
    compressedSize: Number.isFinite(compressedSize) ? compressedSize : typedBlob.size,
    savedPercent: Number.isFinite(savedPercent) ? savedPercent : 0,
    outputFormat,
    targetSize: Number.isFinite(targetSize) ? targetSize : input.targetSize,
    targetMet: response.getResponseHeader("X-Target-Met") === "1",
    skipped: response.getResponseHeader("X-Skipped") === "1",
  };
}
