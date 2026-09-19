import { describe, expect, it } from "vitest";
import { getPublicToolAccessCopy, LAUNCH_ACCESS } from "@/lib/plans";

describe("launch access configuration", () => {
  it("keeps the anonymous compressor limit at 5", () => {
    expect(LAUNCH_ACCESS.anonymousCompressorLimit).toBe(5);
  });

  it("labels public tool cards for the free launch model", () => {
    expect(getPublicToolAccessCopy("image-compressor")).toEqual({ tier: "FREE", detail: "Available" });
    expect(getPublicToolAccessCopy("image-resizer")).toEqual({
      tier: "FREE",
      detail: "Login Required",
    });
    expect(getPublicToolAccessCopy("image-cropper")).toEqual({
      tier: "FREE",
      detail: "Login Required",
    });
    expect(getPublicToolAccessCopy("image-converter")).toEqual({
      tier: "FREE",
      detail: "Login Required",
    });
    expect(getPublicToolAccessCopy("pdf-compressor")).toBeNull();
  });

  it("shows available for login-gated tools when the viewer is authenticated", () => {
    expect(getPublicToolAccessCopy("image-resizer", { authenticated: true })).toEqual({
      tier: "FREE",
      detail: "Available",
    });
  });
});
