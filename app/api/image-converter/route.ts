import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { FORMAT_TO_EXTENSION, FORMAT_TO_MIME } from "@/lib/compression/formats";
import { detectImageFormat } from "@/lib/compression/magic-bytes";
import { withTempDirectory } from "@/lib/compression/temp-files";
import { releaseToolAccess, reserveToolAccess, resolveAccessIdentity } from "@/lib/access";
import { MAX_REQUEST_BYTES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { convertImage } from "@/lib/convert/convert-image";
import { AppError, errorJson } from "@/lib/errors";
import { attachmentDisposition } from "@/lib/http";
import { ensurePersistence } from "@/lib/persistence/ensure";
import { applySessionHeaders } from "@/lib/session";
import { sanitizeDownloadBase } from "@/lib/utils";
import { parseConvertFields } from "@/lib/validation/convert";
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

export async function POST(request: Request): Promise<Response> {
  const identity = await resolveAccessIdentity(request);
  const sessionId = identity.sessionId;
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
      throw new AppError("MISSING_FILE", "Please choose an image to convert.", 400);
    }

    if (fileValue.size > MAX_UPLOAD_BYTES) {
      throw new AppError(
        "FILE_TOO_LARGE",
        `Images must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
        413
      );
    }

    const fields = parseConvertFields({
      outputFormat: formData.get("outputFormat"),
      quality: formData.get("quality"),
    });

    const contents = Buffer.from(await fileValue.arrayBuffer());
    const validated = validateUpload(fileValue, contents);
    await assertValidImageContents(contents, validated.detectedFormat);

    try {
      await ensurePersistence();
    } catch {
      return withSession(databaseUnavailable(), sessionId);
    }

    let reserved;
    try {
      reserved = await reserveToolAccess("image-converter", identity);
    } catch (error) {
      if (error instanceof AppError) {
        return withSession(errorJson(error.code, error.message, error.status), sessionId);
      }
      return withSession(databaseUnavailable(), sessionId);
    }
    accessReservation = reserved;

    const result = await withTempDirectory(async (directory) => {
      const inputPath = path.join(
        directory,
        `input.${FORMAT_TO_EXTENSION[validated.detectedFormat]}`
      );
      const outputPath = path.join(directory, `output.${FORMAT_TO_EXTENSION[fields.outputFormat]}`);
      await writeFile(inputPath, contents);

      const converted = await convertImage({
        inputPath,
        outputPath,
        originalBytes: contents.byteLength,
        outputFormat: fields.outputFormat,
        quality: fields.quality,
      });

      const outputBuffer = await readFile(outputPath);
      return { converted, outputBuffer };
    });

    if (
      result.outputBuffer.length === 0 ||
      detectImageFormat(result.outputBuffer) !== result.converted.outputFormat
    ) {
      throw new AppError(
        "CONVERSION_FAILED",
        "Conversion failed. Please try again with a different image or format.",
        500
      );
    }

    const filename = `${sanitizeDownloadBase(fileValue.name)}.${FORMAT_TO_EXTENSION[result.converted.outputFormat]}`;

    const response = new Response(new Uint8Array(result.outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": FORMAT_TO_MIME[result.converted.outputFormat],
        "Content-Disposition": attachmentDisposition(filename),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "X-Success": "1",
        "X-Original-Size": String(contents.byteLength),
        "X-Output-Size": String(result.converted.outputBytes),
        "X-Original-Width": String(result.converted.originalWidth),
        "X-Original-Height": String(result.converted.originalHeight),
        "X-Output-Width": String(result.converted.outputWidth),
        "X-Output-Height": String(result.converted.outputHeight),
        "X-Original-Format": result.converted.originalFormat,
        "X-Output-Format": result.converted.outputFormat,
        "X-Size-Delta-Percent": String(result.converted.sizeDeltaPercent),
        "Access-Control-Expose-Headers":
          "Content-Disposition, X-Success, X-Original-Size, X-Output-Size, X-Original-Width, X-Original-Height, X-Output-Width, X-Output-Height, X-Original-Format, X-Output-Format, X-Size-Delta-Percent, X-Session-Id",
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
        "Conversion failed. Please try again with a different image or format.",
        500
      ),
      sessionId
    );
  }
}
