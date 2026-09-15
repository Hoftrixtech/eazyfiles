import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { parseCropFields } from "@/lib/validation/crop";

describe("parseCropFields", () => {
  it("accepts valid whole-number crop coordinates", () => {
    const fields = parseCropFields({
      x: "12",
      y: "8",
      width: "320",
      height: "180",
      outputFormat: "webp",
    });

    expect(fields).toEqual({
      x: 12,
      y: 8,
      width: 320,
      height: 180,
      outputFormat: "webp",
    });
  });

  it("allows a crop that starts at the origin", () => {
    const fields = parseCropFields({
      x: "0",
      y: "0",
      width: "10",
      height: "10",
      outputFormat: "original",
    });

    expect(fields.x).toBe(0);
    expect(fields.y).toBe(0);
  });

  it("rejects negative, empty and non-numeric crop values", () => {
    for (const [x, y, width, height] of [
      ["-1", "0", "10", "10"],
      ["0", "-2", "10", "10"],
      ["", "0", "10", "10"],
      ["0", "0", "0", "10"],
      ["0", "0", "10.5", "10"],
      ["nope", "0", "10", "10"],
    ] as const) {
      try {
        parseCropFields({ x, y, width, height, outputFormat: "jpeg" });
        throw new Error(`expected ${x},${y},${width}x${height} to fail`);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).code).toBe("INVALID_CROP");
        expect((error as AppError).status).toBe(400);
      }
    }
  });

  it("rejects an unreasonable crop pixel count", () => {
    try {
      parseCropFields({
        x: "0",
        y: "0",
        width: "8192",
        height: "8192",
        outputFormat: "jpeg",
      });
      throw new Error("expected oversized crop to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_CROP");
    }
  });
});
