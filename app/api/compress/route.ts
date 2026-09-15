import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { compressToTarget } from "@/lib/compression/compress-to-target";
import { FORMAT_TO_EXTENSION, FORMAT_TO_MIME } from "@/lib/compression/formats";
import { detectImageFormat } from "@/lib/compression/magic-bytes";
import { withTempDirectory } from "@/lib/compression/temp-files";
import { releaseToolAccess, reserveToolAccess, resolveAccessIdentity } from "@/lib/access";
import { MAX_REQUEST_BYTES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { AppError, errorJson } from "@/lib/errors";
import { completeJob, createProcessingJob, failJob } from "@/lib/jobs";
import { ensurePersistence } from "@/lib/persistence/ensure";
import { applySessionHeaders } from "@/lib/session";
import { secondsUntilUtcMidnight } from "@/lib/usage";
import { sanitizeDownloadBase, sanitizeStoredFileName } from "@/lib/utils";
import {
  assertValidImageContents,
  parseCompressFields,
  resolveOutputFormat,
  validateUpload,
} from "@/lib/validation/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function contentDisposition(filename: string): string {
  const safe = filename.replace(/[\r\n"]/g, "").replace(/[^\w.-]+/g, "_").slice(0, 100) || "image";
  return `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}

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

export async function POST(request: Request): Promise<Response> {
  const identity = await resolveAccessIdentity(request);
  const sessionId = identity.sessionId;
  let jobId: string | null = null;
  let accessReservation: Awaited<ReturnType<typeof reserveToolAccess>> | null = null;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return withSession(
        errorJson("INVALID_REQUEST", "Send the image as multipart form data.", 400),
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
            `Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
            413
          ),
          sessionId
        );
      }
    }

    const formData = await request.formData();
    const fileValue = formData.get("file");

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      throw new AppError("MISSING_FILE", "Please choose an image to compress.", 400);
    }

    if (fileValue.size > MAX_UPLOAD_BYTES) {
      throw new AppError(
        "FILE_TOO_LARGE",
        `Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
        413
      );
    }

    const fields = parseCompressFields({
      targetSize: formData.get("targetSize"),
      targetUnit: formData.get("targetUnit"),
      outputFormat: formData.get("outputFormat"),
    });

    const contents = Buffer.from(await fileValue.arrayBuffer());
    const validated = validateUpload(fileValue, contents);
    await assertValidImageContents(contents, validated.detectedFormat);
    const resolvedFormat = resolveOutputFormat(fields.outputFormat, validated.detectedFormat);
    const originalFileName = sanitizeStoredFileName(fileValue.name);

    try {
      await ensurePersistence();
    } catch {
      return withSession(databaseUnavailable(), sessionId);
    }

    let reserved;
    try {
      reserved = await reserveToolAccess("compress", identity);
    } catch (error) {
      if (error instanceof AppError) {
        const extra =
          error.code === "RATE_LIMITED" ? { "Retry-After": String(secondsUntilUtcMidnight()) } : undefined;
        return withSession(errorJson(error.code, error.message, error.status, extra), sessionId);
      }
      return withSession(databaseUnavailable(), sessionId);
    }
    accessReservation = reserved;

    try {
      jobId = await createProcessingJob({
        sessionId,
        originalFileName,
        originalFormat: validated.detectedFormat,
        outputFormat: resolvedFormat,
        originalSize: contents.byteLength,
        targetSize: fields.targetSize,
      });
    } catch {
      await releaseToolAccess(accessReservation);
      accessReservation = null;
      return withSession(databaseUnavailable(), sessionId);
    }

    const result = await withTempDirectory(async (directory) => {
      const inputPath = path.join(
        directory,
        `input.${FORMAT_TO_EXTENSION[validated.detectedFormat]}`
      );
      const outputPath = path.join(directory, `output.${FORMAT_TO_EXTENSION[resolvedFormat]}`);

      await writeFile(inputPath, contents);

      const compressed = await compressToTarget({
        inputPath,
        outputPath,
        originalBytes: contents.byteLength,
        targetBytes: fields.targetSize,
        outputFormat: resolvedFormat,
      });

      const outputBuffer = await readFile(outputPath);
      return { compressed, outputBuffer };
    });

    if (
      result.outputBuffer.length === 0 ||
      detectImageFormat(result.outputBuffer) !== result.compressed.outputFormat
    ) {
      throw new AppError(
        "COMPRESSION_FAILED",
        "Compression failed. Please try again with a different image or target size.",
        500
      );
    }

    try {
      await completeJob(jobId, {
        compressedSize: result.compressed.compressedBytes,
        compressionPercentage: result.compressed.compressionPercentage,
        outputFormat: result.compressed.outputFormat,
      });
    } catch {
      try {
        await completeJob(jobId, {
          compressedSize: result.compressed.compressedBytes,
          compressionPercentage: result.compressed.compressionPercentage,
          outputFormat: result.compressed.outputFormat,
        });
      } catch {
        // The compressed file is still returned if job metadata cannot be updated.
      }
    }

    const filename = `${sanitizeDownloadBase(fileValue.name)}-compressed.${FORMAT_TO_EXTENSION[result.compressed.outputFormat]}`;

    const response = new Response(new Uint8Array(result.outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": FORMAT_TO_MIME[result.compressed.outputFormat],
        "Content-Disposition": contentDisposition(filename),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "X-Success": "1",
        "X-Original-Size": String(contents.byteLength),
        "X-Compressed-Size": String(result.compressed.compressedBytes),
        "X-Saved-Percent": String(result.compressed.compressionPercentage),
        "X-Output-Format": result.compressed.outputFormat,
        "X-Target-Size": String(fields.targetSize),
        "X-Target-Met": result.compressed.targetMet ? "1" : "0",
        "X-Skipped": result.compressed.skipped ? "1" : "0",
        "Access-Control-Expose-Headers":
          "Content-Disposition, X-Success, X-Original-Size, X-Compressed-Size, X-Saved-Percent, X-Output-Format, X-Target-Size, X-Target-Met, X-Skipped, X-Session-Id",
      },
    });

    return withSession(response, sessionId);
  } catch (error) {
    if (accessReservation) {
      await releaseToolAccess(accessReservation);
    }

    await failJob(jobId).catch(() => undefined);

    if (error instanceof AppError) {
      return withSession(errorJson(error.code, error.message, error.status), sessionId);
    }

    return withSession(
      errorJson(
        "COMPRESSION_FAILED",
        "Compression failed. Please try again with a different image or target size.",
        500
      ),
      sessionId
    );
  }
}
