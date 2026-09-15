import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { createSessionId } from "@/lib/session-id";

const { resolveAccessIdentity, reserveToolAccess, releaseToolAccess } = vi.hoisted(() => ({
  resolveAccessIdentity: vi.fn(),
  reserveToolAccess: vi.fn(),
  releaseToolAccess: vi.fn(),
}));

const ensurePersistence = vi.fn(async () => "mongo" as const);
const createProcessingJob = vi.fn();
const completeJob = vi.fn();
const failJob = vi.fn();
const compressToTarget = vi.fn();

vi.mock("@/lib/persistence/ensure", () => ({
  ensurePersistence: () => ensurePersistence(),
}));

vi.mock("@/lib/access", () => ({
  resolveAccessIdentity: (request: Request) => resolveAccessIdentity(request),
  reserveToolAccess: (...args: unknown[]) => reserveToolAccess(...args),
  releaseToolAccess: (...args: unknown[]) => releaseToolAccess(...args),
}));

vi.mock("@/lib/jobs", () => ({
  createProcessingJob: (input: unknown) => createProcessingJob(input),
  completeJob: (jobId: unknown, input: unknown) => completeJob(jobId, input),
  failJob: (jobId: unknown) => failJob(jobId),
}));

vi.mock("@/lib/compression/compress-to-target", () => ({
  compressToTarget: (...args: unknown[]) => compressToTarget(...args),
}));

const { POST } = await import("@/app/api/compress/route");

async function tinyJpeg(): Promise<Buffer> {
  return sharp({
    create: {
      width: 16,
      height: 16,
      channels: 3,
      background: { r: 12, g: 80, b: 160 },
    },
  })
    .jpeg({ quality: 70 })
    .toBuffer();
}

async function makeRequest(options?: {
  file?: File | null;
  fileName?: string;
  type?: string;
  bytes?: Buffer;
  targetSize?: string;
  outputFormat?: string;
  sessionId?: string;
  omitFile?: boolean;
  jsonBody?: boolean;
}): Promise<Request> {
  if (options?.jsonBody) {
    return new Request("http://localhost/api/compress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  const form = new FormData();
  if (!options?.omitFile) {
    const bytes = options?.bytes ?? (await tinyJpeg());
    const file =
      options?.file ??
      new File([new Uint8Array(bytes)], options?.fileName ?? "photo.jpg", {
        type: options?.type ?? "image/jpeg",
      });
    form.append("file", file);
  }

  form.append("targetSize", options?.targetSize ?? String(100 * 1024));
  form.append("outputFormat", options?.outputFormat ?? "jpeg");

  const headers: Record<string, string> = {};
  if (options?.sessionId) {
    headers["x-session-id"] = options.sessionId;
  }

  return new Request("http://localhost/api/compress", {
    method: "POST",
    headers,
    body: form,
  });
}

describe("POST /api/compress", () => {
  beforeEach(() => {
    ensurePersistence.mockResolvedValue("mongo");
    resolveAccessIdentity.mockImplementation(async (request: Request) => ({
      sessionId: request.headers.get("x-session-id") || createSessionId(),
      userId: null,
    }));
    reserveToolAccess.mockImplementation(async (_tool: string, identity: { sessionId: string }) => ({
      kind: "anonymous-compress",
      sessionId: identity.sessionId,
    }));
    releaseToolAccess.mockResolvedValue(undefined);
    createProcessingJob.mockResolvedValue("job-1");
    completeJob.mockResolvedValue(undefined);
    failJob.mockResolvedValue(undefined);
    compressToTarget.mockImplementation(async (input: { inputPath: string; outputPath: string; outputFormat: string; targetBytes: number }) => {
      const { copyFile, stat } = await import("node:fs/promises");
      await copyFile(input.inputPath, input.outputPath);
      const size = (await stat(input.outputPath)).size;
      return {
        compressedBytes: size,
        originalFormat: "jpeg",
        outputFormat: input.outputFormat,
        width: 16,
        height: 16,
        targetMet: size <= input.targetBytes,
        compressionPercentage: 0,
        skipped: true,
        quality: null,
      };
    });
  });

  it("compresses a valid request and records a completed job", async () => {
    const sessionId = createSessionId();
    const response = await POST(await makeRequest({ sessionId }));
    const body = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Success")).toBe("1");
    expect(body.length).toBeGreaterThan(0);
    expect(createProcessingJob).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId,
        originalFileName: "photo.jpg",
        originalFormat: "jpeg",
        outputFormat: "jpeg",
      })
    );
    expect(completeJob).toHaveBeenCalledWith(
      "job-1",
      expect.objectContaining({
        compressedSize: expect.any(Number),
      })
    );
    expect(failJob).not.toHaveBeenCalled();
  });

  it("rejects a missing file", async () => {
    const response = await POST(await makeRequest({ omitFile: true }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("MISSING_FILE");
    expect(createProcessingJob).not.toHaveBeenCalled();
  });

  it("rejects an unsupported format", async () => {
    const response = await POST(
      await makeRequest({
        fileName: "notes.txt",
        type: "text/plain",
        bytes: Buffer.from("hello"),
      })
    );
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(415);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("UNSUPPORTED_TYPE");
  });

  it("rejects undecodable JPEG contents before creating a job", async () => {
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const response = await POST(
      await makeRequest({
        fileName: "broken.jpg",
        type: "image/jpeg",
        bytes: jpegHeader,
      })
    );
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(422);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("INVALID_IMAGE");
    expect(createProcessingJob).not.toHaveBeenCalled();
    expect(compressToTarget).not.toHaveBeenCalled();
  });

  it("rejects an oversized file before creating a job", async () => {
    const oversized = Buffer.alloc(MAX_UPLOAD_BYTES + 1, 0xff);
    const response = await POST(
      await makeRequest({
        fileName: "huge.jpg",
        type: "image/jpeg",
        bytes: oversized,
      })
    );
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(413);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("FILE_TOO_LARGE");
    expect(createProcessingJob).not.toHaveBeenCalled();
    expect(compressToTarget).not.toHaveBeenCalled();
  });

  it("rejects an oversized Content-Length before parsing the body", async () => {
    const response = await POST(
      new Request("http://localhost/api/compress", {
        method: "POST",
        headers: {
          "content-type": "multipart/form-data; boundary=----test",
          "content-length": String(MAX_UPLOAD_BYTES + 2 * 1024 * 1024),
        },
        body: "x",
      })
    );
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(413);
    expect(payload.error.code).toBe("FILE_TOO_LARGE");
    expect(createProcessingJob).not.toHaveBeenCalled();
  });

  it("rejects an invalid target size", async () => {
    const response = await POST(await makeRequest({ targetSize: "12" }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("INVALID_TARGET");
  });

  it("returns 403 after the anonymous compressor limit is reached", async () => {
    reserveToolAccess.mockRejectedValueOnce(
      new AppError(
        "ANONYMOUS_LIMIT_REACHED",
        "You've used your 5 free compressions. Create an account to continue.",
        403
      )
    );
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const payload = (await response.json()) as { success: boolean; error: { code: string; message: string } };

    expect(response.status).toBe(403);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("ANONYMOUS_LIMIT_REACHED");
    expect(payload.error.message).toMatch(/5 free compressions/i);
    expect(createProcessingJob).not.toHaveBeenCalled();
  });

  it("returns 429 when an authenticated daily limit is reached", async () => {
    resolveAccessIdentity.mockResolvedValueOnce({
      sessionId: createSessionId(),
      userId: "user-1",
    });
    reserveToolAccess.mockRejectedValueOnce(
      new AppError("RATE_LIMITED", "Daily compression limit reached. Please try again tomorrow.", 429)
    );
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const payload = (await response.json()) as { success: boolean; error: { code: string; message: string } };

    expect(response.status).toBe(429);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("RATE_LIMITED");
    expect(payload.error.message).toMatch(/daily compression limit/i);
    expect(createProcessingJob).not.toHaveBeenCalled();
  });

  it("returns 503 when persistence is unavailable", async () => {
    ensurePersistence.mockRejectedValueOnce(new Error("database down"));
    const response = await POST(await makeRequest());
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(503);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("DATABASE_UNAVAILABLE");
    expect(createProcessingJob).not.toHaveBeenCalled();
  });

  it("marks the job failed and releases usage when compression throws", async () => {
    compressToTarget.mockRejectedValueOnce(new Error("sharp exploded"));
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };

    expect(response.status).toBe(500);
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe("COMPRESSION_FAILED");
    expect(failJob).toHaveBeenCalledWith("job-1");
    expect(releaseToolAccess).toHaveBeenCalled();
  });
});
