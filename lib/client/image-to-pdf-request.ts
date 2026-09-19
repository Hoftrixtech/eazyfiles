import { throwFromApiPayload } from "@/lib/client/api-error";
import { SESSION_HEADER_NAME } from "@/lib/constants";
import { getAnonymousSessionId, persistAnonymousSessionId } from "@/lib/client/session";
import type { PdfPageLayout } from "@/types/pdf";

export interface ImageToPdfClientResult {
  blob: Blob;
  objectUrl: string;
  filename: string;
  pageCount: number;
  originalSize: number;
  outputSize: number;
  pageLayout: PdfPageLayout;
}

function safeDownloadName(value: string): string {
  return value.replace(/[\\/]+/g, "").replace(/[\r\n"]/g, "").slice(0, 120) || "images";
}

function filenameFromDisposition(header: string | null): string {
  if (!header) {
    return "images.pdf";
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
  return safeDownloadName(asciiMatch?.[1] ?? "images.pdf");
}

export async function imageToPdfRequest(input: {
  files: File[];
  pageLayout: PdfPageLayout;
}): Promise<ImageToPdfClientResult> {
  const body = new FormData();
  for (const file of input.files) {
    body.append("files", file);
  }
  body.append("pageLayout", input.pageLayout);

  const sessionId = getAnonymousSessionId();

  let response: Response;
  try {
    response = await fetch("/api/image-to-pdf", {
      method: "POST",
      body,
      credentials: "same-origin",
      headers: sessionId ? { [SESSION_HEADER_NAME]: sessionId } : undefined,
    });
  } catch {
    throw new Error("We could not reach the PDF service. Check your connection and try again.");
  }

  const returnedSession = response.headers.get("X-Session-Id");
  if (returnedSession) {
    persistAnonymousSessionId(returnedSession);
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throwFromApiPayload(payload, "PDF creation failed. Please try different images.");
  }

  const blob = await response.blob();
  const typedBlob =
    blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
  const pageCount = Number(response.headers.get("X-Page-Count") ?? input.files.length);
  const originalSize = Number(response.headers.get("X-Original-Size") ?? 0);
  const outputSize = Number(response.headers.get("X-Output-Size") ?? typedBlob.size);
  const pageLayoutHeader = response.headers.get("X-Page-Layout");
  const pageLayout: PdfPageLayout = pageLayoutHeader === "a4-fit" ? "a4-fit" : input.pageLayout;

  return {
    blob: typedBlob,
    objectUrl: URL.createObjectURL(typedBlob),
    filename: filenameFromDisposition(response.headers.get("Content-Disposition")),
    pageCount: Number.isFinite(pageCount) ? pageCount : input.files.length,
    originalSize: Number.isFinite(originalSize) ? originalSize : 0,
    outputSize: Number.isFinite(outputSize) ? outputSize : typedBlob.size,
    pageLayout,
  };
}
