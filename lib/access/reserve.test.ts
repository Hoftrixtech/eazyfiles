import { beforeEach, describe, expect, it, vi } from "vitest";

const reserveAnonymousCompressor = vi.fn();
const releaseAnonymousCompressor = vi.fn();
const reserveUsageSlot = vi.fn();
const releaseUsageSlot = vi.fn();

vi.mock("@/lib/access/anonymous-compress", () => ({
  getAnonymousCompressorCount: vi.fn(),
  reserveAnonymousCompressor: (...args: unknown[]) => reserveAnonymousCompressor(...args),
  releaseAnonymousCompressor: (...args: unknown[]) => releaseAnonymousCompressor(...args),
}));

vi.mock("@/lib/usage", () => ({
  reserveUsageSlot: (...args: unknown[]) => reserveUsageSlot(...args),
  releaseUsageSlot: (...args: unknown[]) => releaseUsageSlot(...args),
}));

const { releaseToolAccess, reserveToolAccess } = await import("@/lib/access/reserve");

describe("reserveToolAccess", () => {
  beforeEach(() => {
    reserveAnonymousCompressor.mockReset();
    releaseAnonymousCompressor.mockReset();
    reserveUsageSlot.mockReset();
    releaseUsageSlot.mockReset();
  });

  it("allows anonymous compressor use while under the free limit", async () => {
    reserveAnonymousCompressor.mockResolvedValue(true);
    const reservation = await reserveToolAccess("compress", { sessionId: "session-1", userId: null });
    expect(reservation).toEqual({ kind: "anonymous-compress", sessionId: "session-1" });
  });

  it("rejects anonymous compressor use after 5 successful compressions", async () => {
    reserveAnonymousCompressor.mockResolvedValue(false);
    await expect(reserveToolAccess("compress", { sessionId: "session-1", userId: null })).rejects.toMatchObject({
      code: "ANONYMOUS_LIMIT_REACHED",
      status: 403,
    });
  });

  it("rejects anonymous premium tool processing", async () => {
    await expect(
      reserveToolAccess("image-resizer", { sessionId: "session-1", userId: null })
    ).rejects.toMatchObject({
      code: "AUTH_REQUIRED",
      status: 401,
    });
  });

  it("allows authenticated users free access to image tools without trials", async () => {
    const reservation = await reserveToolAccess("image-cropper", { sessionId: "session-1", userId: "user-1" });
    expect(reservation).toEqual({ kind: "authenticated-tool", userId: "user-1", toolSlug: "image-cropper" });
  });

  it("allows authenticated compressor with the abuse daily limit", async () => {
    reserveUsageSlot.mockResolvedValue(true);
    await reserveToolAccess("compress", { sessionId: "session-1", userId: "user-1" });
    expect(reserveUsageSlot).toHaveBeenCalledWith("user:user-1", 50);
  });

  it("releases anonymous compressor slots on failure", async () => {
    await releaseToolAccess({ kind: "anonymous-compress", sessionId: "session-1" });
    expect(releaseAnonymousCompressor).toHaveBeenCalledWith("session-1");
  });
});
