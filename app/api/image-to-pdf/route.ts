import "server-only";

import { releaseToolAccess, reserveToolAccess, resolveAccessIdentity } from "@/lib/access";
import { MAX_IMAGE_TO_PDF_FILES, MAX_REQUEST_BYTES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { AppError, errorJson } from "@/lib/errors";
import { attachmentDisposition } from "@/lib/http";
import { imagesToPdf } from "@/lib/pdf/images-to-pdf";
import { ensurePersistence } from "@/lib/persistence/ensure";
import { applySessionHeaders } from "@/lib/session";
import { sanitizeDownloadBase } from "@/lib/utils";
import { parsePdfPageLayout } from "@/lib/validation/image-to-pdf";
import { assertValidImageContents, validateUpload } from "@/lib/validation/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function withSession(response: Response, sessionId: string): Response {
  applySessionHeaders(response.headers, sessionId);
  return response;
}

function databaseUnavailable(): Response {
  return errorJson(
    "DATABASE_UNAVAILABLE",
    "The service is temporarily unavailable. Please try again shortly.",
    503
  );
}

function collectFiles(formData: FormData): File[] {
  const fromFiles = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (fromFiles.length > 0) {
    return fromFiles;
  }

  const single = formData.get("file");
  if (single instanceof File && single.size > 0) {
    return [single];
  }

  return [];
}

export async function POST(request: Request): Promise<Response> {
  const identity = await resolveAccessIdentity(request);
  const sessionId = identity.sessionId;
  let accessReservation: Awaited<ReturnType<typeof reserveToolAccess>> | null = null;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return withSession(
        errorJson("INVALID_REQUEST", "Send images as multipart form data.", 400),
        sessionId
      );
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        return withSession(
          errorJson(
            "FILE_TOO_LARGE",
            `The total upload must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller per file.`,
            413
          ),
          sessionId
        );
      }
    }

    const formData = await request.formData();
    const files = collectFiles(formData);

    if (files.length === 0) {
      throw new AppError("MISSING_FILE", "Please choose at least one image to convert.", 400);
    }

    if (files.length > MAX_IMAGE_TO_PDF_FILES) {
      throw new AppError(
        "INVALID_REQUEST",
        `You can add up to ${MAX_IMAGE_TO_PDF_FILES} images per PDF.`,
        400
      );
    }

    const pageLayout = parsePdfPageLayout(formData.get("pageLayout"));

    const buffers: Buffer[] = [];
    let totalBytes = 0;
    for (const file of files) {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new AppError(
          "FILE_TOO_LARGE",
          `Each image must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
          413
        );
      }
      totalBytes += file.size;
      if (totalBytes > MAX_REQUEST_BYTES) {
        throw new AppError("FILE_TOO_LARGE", "The combined upload is too large. Try fewer or smaller images.", 413);
      }

      const contents = Buffer.from(await file.arrayBuffer());
      const validated = validateUpload(file, contents);
      await assertValidImageContents(contents, validated.detectedFormat);
      buffers.push(contents);
    }

    try {
      await ensurePersistence();
    } catch {
      return withSession(databaseUnavailable(), sessionId);
    }

    let reserved;
    try {
      reserved = await reserveToolAccess("image-to-pdf", identity);
    } catch (error) {
      if (error instanceof AppError) {
        return withSession(errorJson(error.code, error.message, error.status), sessionId);
      }
      return withSession(databaseUnavailable(), sessionId);
    }
    accessReservation = reserved;

    const result = await imagesToPdf(buffers, pageLayout);
    const baseName = sanitizeDownloadBase(files[0]?.name ?? "images");
    const filename = `${baseName}.pdf`;

    const response = new Response(new Uint8Array(result.pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": attachmentDisposition(filename),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "X-Success": "1",
        "X-Page-Count": String(result.pageCount),
        "X-Original-Size": String(result.totalInputBytes),
        "X-Output-Size": String(result.pdfBytes.byteLength),
        "X-Page-Layout": pageLayout,
        "Access-Control-Expose-Headers":
          "Content-Disposition, X-Success, X-Page-Count, X-Original-Size, X-Output-Size, X-Page-Layout, X-Session-Id",
      },
    });

    return withSession(response, sessionId);
  } catch (error) {
    if (accessReservation) {
      await releaseToolAccess(accessReservation);
    }

    if (error instanceof AppError) {
      return withSession(errorJson(error.code, error.message, error.status), sessionId);
    }

    return withSession(
      errorJson(
        "CONVERSION_FAILED",
        "Could not create the PDF. Please try again with different images.",
        500
      ),
      sessionId
    );
  }
}
