import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { parseResizeFields } from "@/lib/validation/resize";

describe("parseResizeFields", () => {
  it("accepts valid whole-number dimensions", () => {
    const fields = parseResizeFields({
      width: "800",
      height: "600",
      outputFormat: "webp",
    });

    expect(fields).toEqual({
      width: 800,
      height: 600,
      outputFormat: "webp",
    });
  });

  it("rejects zero, negative, empty and non-numeric dimensions", () => {
    for (const [width, height] of [
      ["0", "100"],
      ["-10", "100"],
      ["", "100"],
      ["nope", "100"],
      ["100.5", "100"],
    ] as const) {
      try {
        parseResizeFields({ width, height, outputFormat: "original" });
        throw new Error(`expected ${width}x${height} to fail`);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe("INVALID_DIMENSIONS");
        expect((error as AppError).status).toBe(400);
      }
    }
  });

  it("rejects an unreasonable pixel count", () => {
    try {
      parseResizeFields({
        width: "8192",
        height: "8192",
        outputFormat: "jpeg",
      });
      throw new Error("expected oversized pixel count to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_DIMENSIONS");
    }
  });
});
