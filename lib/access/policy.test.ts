import { beforeEach, describe, expect, it, vi } from "vitest";

const getAnonymousCompressorCount = vi.hoisted(() => vi.fn(async () => 0));
const getTodayCompressionCount = vi.hoisted(() => vi.fn(async () => 0));

vi.mock("@/lib/access/anonymous-compress", () => ({
  getAnonymousCompressorCount: () => getAnonymousCompressorCount(),
}));

vi.mock("@/lib/usage", () => ({
  getTodayCompressionCount: () => getTodayCompressionCount(),
}));

const { canUseTool } = await import("@/lib/access/policy");

describe("canUseTool", () => {
  beforeEach(() => {
    getAnonymousCompressorCount.mockResolvedValue(0);
    getTodayCompressionCount.mockResolvedValue(0);
  });

  it("allows anonymous compressor use under the configured free limit", async () => {
    const result = await canUseTool("compress", { sessionId: "s1", userId: null });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("anonymous");
  });

  it("denies anonymous premium tools", async () => {
    const result = await canUseTool("image-resizer", { sessionId: "s1", userId: null });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("auth-required");
  });

  it("allows logged-in users free access to all image tools", async () => {
    await expect(canUseTool("image-cropper", { sessionId: "s1", userId: "user-1" })).resolves.toMatchObject({
      allowed: true,
      reason: "authenticated",
    });
    await expect(canUseTool("image-converter", { sessionId: "s1", userId: "user-1" })).resolves.toMatchObject({
      allowed: true,
      reason: "authenticated",
    });
  });
});
