import { describe, expect, it } from "vitest";
import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS } from "@/lib/constants";
import { fitInside, isAllowedResizeSize, sizeFromHeight, sizeFromPercent, sizeFromWidth } from "@/lib/resize/dimensions";

describe("resize dimension helpers", () => {
  it("scales both sides from a percent", () => {
    expect(sizeFromPercent({ width: 200, height: 100 }, 50)).toEqual({ width: 100, height: 50 });
  });

  it("updates height from width when keeping aspect ratio", () => {
    expect(sizeFromWidth({ width: 200, height: 100 }, 80)).toEqual({ width: 80, height: 40 });
  });

  it("updates width from height when keeping aspect ratio", () => {
    expect(sizeFromHeight({ width: 200, height: 100 }, 50)).toEqual({ width: 100, height: 50 });
  });

  it("fits inside a preset box without stretching", () => {
    expect(fitInside({ width: 400, height: 800 }, { width: 1920, height: 1080 })).toEqual({
      width: 540,
      height: 1080,
    });
  });

  it("rejects zero, negative and oversized sizes", () => {
    expect(isAllowedResizeSize(0, 100)).toBe(false);
    expect(isAllowedResizeSize(-1, 100)).toBe(false);
    expect(isAllowedResizeSize(MAX_RESIZE_EDGE + 1, 10)).toBe(false);
    expect(isAllowedResizeSize(MAX_RESIZE_EDGE, MAX_RESIZE_EDGE)).toBe(
      MAX_RESIZE_EDGE * MAX_RESIZE_EDGE <= MAX_RESIZE_PIXELS
    );
  });
});
