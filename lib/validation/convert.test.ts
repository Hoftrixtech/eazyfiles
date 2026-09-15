import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { parseConvertFields } from "@/lib/validation/convert";

describe("parseConvertFields", () => {
  it("accepts a supported output format and quality", () => {
    const fields = parseConvertFields({
      outputFormat: "webp",
      quality: "balanced",
    });

    expect(fields).toEqual({
      outputFormat: "webp",
      quality: "balanced",
    });
  });

  it("defaults quality to high", () => {
    const fields = parseConvertFields({
      outputFormat: "png",
      quality: null,
    });

    expect(fields.quality).toBe("high");
  });

  it("rejects an invalid output format", () => {
    try {
      parseConvertFields({
        outputFormat: "gif",
        quality: "high",
      });
      throw new Error("expected invalid format to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_OUTPUT_FORMAT");
      expect((error as AppError).status).toBe(400);
    }
  });

  it("rejects original as an output format", () => {
    try {
      parseConvertFields({
        outputFormat: "original",
        quality: "high",
      });
      throw new Error("expected original format to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_OUTPUT_FORMAT");
    }
  });

  it("rejects an invalid quality value", () => {
    try {
      parseConvertFields({
        outputFormat: "jpeg",
        quality: "ultra",
      });
      throw new Error("expected invalid quality to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_REQUEST");
    }
  });
});
