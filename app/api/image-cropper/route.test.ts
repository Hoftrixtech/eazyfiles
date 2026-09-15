import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";
import { createSessionId } from "@/lib/session-id";

const { resolveAccessIdentity, reserveToolAccess, releaseToolAccess } = vi.hoisted(() => ({
  resolveAccessIdentity: vi.fn(),
  reserveToolAccess: vi.fn(),
  releaseToolAccess: vi.fn(),
}));

const ensurePersistence = vi.fn(async () => "mongo" as const);
const cropImage = vi.fn();

vi.mock("@/lib/persistence/ensure", () => ({
  ensurePersistence: () => ensurePersistence(),
}));

vi.mock("@/lib/access", () => ({
  resolveAccessIdentity: (request: Request) => resolveAccessIdentity(request),
  reserveToolAccess: (...args: unknown[]) => reserveToolAccess(...args),
  releaseToolAccess: (...args: unknown[]) => releaseToolAccess(...args),
}));

vi.mock("@/lib/crop/crop-image", () => ({
  cropImage: (...args: unknown[]) => cropImage(...args),
}));

const { POST } = await import("@/app/api/image-cropper/route");

async function tinyJpeg(): Promise<Buffer> {
  return sharp({
    create: {
      width: 32,
      height: 16,
      channels: 3,
      background: { r: 12, g: 80, b: 160 },
    },
  })
    .jpeg({ quality: 70 })
    .toBuffer();
}

async function makeRequest(options?: {
  fileName?: string;
  type?: string;
  bytes?: Buffer;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  outputFormat?: string;
  sessionId?: string;
  omitFile?: boolean;
  jsonBody?: boolean;
}): Promise<Request> {
  if (options?.jsonBody) {
    return new Request("http://localhost/api/image-cropper", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  const form = new FormData();
  if (!options?.omitFile) {
    const bytes = options?.bytes ?? (await tinyJpeg());
    form.append(
      "file",
      new File([new Uint8Array(bytes)], options?.fileName ?? "photo.jpg", {
        type: options?.type ?? "image/jpeg",
      })
    );
  }

  form.append("x", options?.x ?? "4");
  form.append("y", options?.y ?? "2");
  form.append("width", options?.width ?? "16");
  form.append("height", options?.height ?? "8");
  form.append("outputFormat", options?.outputFormat ?? "jpeg");

  const headers: Record<string, string> = {};
  if (options?.sessionId) {
    headers["x-session-id"] = options.sessionId;
  }

  return new Request("http://localhost/api/image-cropper", {
    method: "POST",
    headers,
    body: form,
  });
}

describe("POST /api/image-cropper", () => {
  beforeEach(() => {
    ensurePersistence.mockResolvedValue("mongo");
    resolveAccessIdentity.mockImplementation(async (request: Request) => ({
      sessionId: request.headers.get("x-session-id") || createSessionId(),
      userId: "user-1",
    }));
    reserveToolAccess.mockResolvedValue({ kind: "trial", userId: "user-1", toolSlug: "image-cropper" });
    releaseToolAccess.mockResolvedValue(undefined);
    cropImage.mockImplementation(async (input: { inputPath: string; outputPath: string; crop: { width: number; height: number }; outputFormat: string }) => {
      const { copyFile, stat } = await import("node:fs/promises");
      await copyFile(input.inputPath, input.outputPath);
      const size = (await stat(input.outputPath)).size;
      return {
        originalWidth: 32,
        originalHeight: 16,
        outputWidth: input.crop.width,
        outputHeight: input.crop.height,
        originalFormat: "jpeg",
        outputFormat: input.outputFormat,
        outputBytes: size,
        sizeDeltaPercent: 0,
      };
    });
  });

  it("crops a valid image and returns the file", async () => {
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const body = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Success")).toBe("1");
    expect(response.headers.get("X-Output-Width")).toBe("16");
    expect(response.headers.get("X-Output-Height")).toBe("8");
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(body.length).toBeGreaterThan(0);
    expect(cropImage).toHaveBeenCalled();
  });

  it("rejects a missing file", async () => {
    const response = await POST(await makeRequest({ omitFile: true }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("MISSING_FILE");
  });

  it("rejects invalid crop coordinates", async () => {
    const response = await POST(await makeRequest({ x: "-1", width: "16" }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("INVALID_CROP");
    expect(cropImage).not.toHaveBeenCalled();
    expect(reserveToolAccess).not.toHaveBeenCalled();
  });

  it("rejects anonymous processing before cropping", async () => {
    resolveAccessIdentity.mockResolvedValueOnce({
      sessionId: createSessionId(),
      userId: null,
    });
    reserveToolAccess.mockRejectedValueOnce(new AppError("AUTH_REQUIRED", "Log in to use this free tool.", 401));
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("AUTH_REQUIRED");
    expect(cropImage).not.toHaveBeenCalled();
  });
});
