import { describe, expect, it } from "vitest";
import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS } from "@/lib/constants";
import {
  applyHandle,
  clampCropRegion,
  defaultCropRegion,
  isValidCropRegion,
  roundRegion,
} from "@/lib/crop/region";

describe("crop region math", () => {
  it("accepts a full-image crop and rejects out-of-bounds regions", () => {
    expect(isValidCropRegion({ x: 0, y: 0, width: 400, height: 200 }, 400, 200)).toBe(true);
    expect(isValidCropRegion({ x: -1, y: 0, width: 10, height: 10 }, 400, 200)).toBe(false);
    expect(isValidCropRegion({ x: 0, y: 0, width: 401, height: 10 }, 400, 200)).toBe(false);
    expect(isValidCropRegion({ x: 390, y: 0, width: 20, height: 10 }, 400, 200)).toBe(false);
    expect(isValidCropRegion({ x: 0, y: 0, width: 0, height: 10 }, 400, 200)).toBe(false);
  });

  it("rejects oversized output dimensions", () => {
    expect(
      isValidCropRegion({ x: 0, y: 0, width: MAX_RESIZE_EDGE, height: MAX_RESIZE_EDGE }, 20000, 20000)
    ).toBe(false);
    expect(MAX_RESIZE_EDGE * MAX_RESIZE_EDGE).toBeGreaterThan(MAX_RESIZE_PIXELS);
  });

  it("centers the largest 1:1 crop on a landscape image", () => {
    const region = defaultCropRegion(400, 200, 1);
    expect(region).toEqual({ x: 100, y: 0, width: 200, height: 200 });
  });

  it("uses an inset rectangle for free crop", () => {
    const region = defaultCropRegion(100, 50, null);
    expect(region.width).toBe(80);
    expect(region.height).toBe(40);
    expect(region.x).toBe(10);
    expect(region.y).toBe(5);
  });

  it("clamps a moved region inside the image without changing size", () => {
    const moved = applyHandle(
      { x: 10, y: 10, width: 40, height: 20 },
      "move",
      1000,
      1000,
      { width: 100, height: 80 },
      null
    );
    expect(moved).toEqual({ x: 60, y: 60, width: 40, height: 20 });
  });

  it("keeps a 16:9 crop inside the image after a resize", () => {
    const next = applyHandle(
      defaultCropRegion(1920, 1080, 16 / 9),
      "se",
      -200,
      0,
      { width: 1920, height: 1080 },
      16 / 9
    );
    expect(isValidCropRegion(next, 1920, 1080)).toBe(true);
    expect(Math.abs(next.width / next.height - 16 / 9)).toBeLessThan(0.02);
  });

  it("rounds fractional regions", () => {
    expect(roundRegion({ x: 1.4, y: 2.6, width: 10.2, height: 8.8 })).toEqual({
      x: 1,
      y: 3,
      width: 10,
      height: 9,
    });
  });

  it("clamps a crop that would overflow the right edge", () => {
    const clamped = clampCropRegion({ x: 90, y: 0, width: 30, height: 10 }, 100, 50);
    expect(clamped.x + clamped.width).toBeLessThanOrEqual(100);
    expect(clamped.y + clamped.height).toBeLessThanOrEqual(50);
  });
});
