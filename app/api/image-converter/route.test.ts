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
const convertImage = vi.fn();

vi.mock("@/lib/persistence/ensure", () => ({
  ensurePersistence: () => ensurePersistence(),
}));

vi.mock("@/lib/access", () => ({
  resolveAccessIdentity: (request: Request) => resolveAccessIdentity(request),
  reserveToolAccess: (...args: unknown[]) => reserveToolAccess(...args),
  releaseToolAccess: (...args: unknown[]) => releaseToolAccess(...args),
}));

vi.mock("@/lib/convert/convert-image", () => ({
  convertImage: (...args: unknown[]) => convertImage(...args),
}));

const { POST } = await import("@/app/api/image-converter/route");

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
  outputFormat?: string;
  quality?: string;
  sessionId?: string;
  omitFile?: boolean;
  jsonBody?: boolean;
}): Promise<Request> {
  if (options?.jsonBody) {
    return new Request("http://localhost/api/image-converter", {
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

  form.append("outputFormat", options?.outputFormat ?? "webp");
  form.append("quality", options?.quality ?? "high");

  const headers: Record<string, string> = {};
  if (options?.sessionId) {
    headers["x-session-id"] = options.sessionId;
  }

  return new Request("http://localhost/api/image-converter", {
    method: "POST",
    headers,
    body: form,
  });
}

describe("POST /api/image-converter", () => {
  beforeEach(() => {
    ensurePersistence.mockResolvedValue("mongo");
    resolveAccessIdentity.mockImplementation(async (request: Request) => ({
      sessionId: request.headers.get("x-session-id") || createSessionId(),
      userId: "user-1",
    }));
    reserveToolAccess.mockResolvedValue({ kind: "trial", userId: "user-1", toolSlug: "image-converter" });
    releaseToolAccess.mockResolvedValue(undefined);
    convertImage.mockImplementation(async (input: { inputPath: string; outputPath: string; outputFormat: string }) => {
      const { writeFile, stat } = await import("node:fs/promises");
      const converted = await sharp(input.inputPath).toFormat(input.outputFormat as "jpeg" | "png" | "webp").toBuffer();
      await writeFile(input.outputPath, converted);
      const size = (await stat(input.outputPath)).size;
      return {
        originalWidth: 32,
        originalHeight: 16,
        outputWidth: 32,
        outputHeight: 16,
        originalFormat: "jpeg",
        outputFormat: input.outputFormat,
        outputBytes: size,
        sizeDeltaPercent: 0,
        quality: "high",
      };
    });
  });

  it("converts a valid image and returns the file", async () => {
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const body = Buffer.from(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Success")).toBe("1");
    expect(response.headers.get("X-Output-Format")).toBe("webp");
    expect(response.headers.get("X-Original-Format")).toBe("jpeg");
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("Content-Disposition")).toContain("photo.webp");
    expect(body.length).toBeGreaterThan(0);
    expect(convertImage).toHaveBeenCalled();
  });

  it("rejects a missing file", async () => {
    const response = await POST(await makeRequest({ omitFile: true }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("MISSING_FILE");
  });

  it("rejects an invalid output format", async () => {
    const response = await POST(await makeRequest({ outputFormat: "gif" }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("INVALID_OUTPUT_FORMAT");
    expect(convertImage).not.toHaveBeenCalled();
    expect(reserveToolAccess).not.toHaveBeenCalled();
  });

  it("rejects anonymous processing before conversion", async () => {
    resolveAccessIdentity.mockResolvedValueOnce({
      sessionId: createSessionId(),
      userId: null,
    });
    reserveToolAccess.mockRejectedValueOnce(new AppError("AUTH_REQUIRED", "Log in to use this free tool.", 401));
    const response = await POST(await makeRequest({ sessionId: createSessionId() }));
    const payload = (await response.json()) as { success: boolean; error: { code: string } };
    expect(response.status).toBe(401);
    expect(payload.error.code).toBe("AUTH_REQUIRED");
    expect(convertImage).not.toHaveBeenCalled();
  });
});
