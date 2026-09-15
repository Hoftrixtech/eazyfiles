import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { assertValidImageContents, parseCompressFields, validateUpload } from "@/lib/validation/upload";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { sanitizeStoredFileName } from "@/lib/utils";

function makeFile(name: string, type: string, contents: Uint8Array): File {
  const copy = new Uint8Array(contents.byteLength);
  copy.set(contents);
  return new File([copy], name, { type });
}

describe("parseCompressFields", () => {
  it("accepts a valid target size in bytes", () => {
    const fields = parseCompressFields({
      targetSize: String(100 * 1024),
      targetUnit: "KB",
      outputFormat: "jpeg",
    });

    expect(fields.targetSize).toBe(100 * 1024);
    expect(fields.outputFormat).toBe("jpeg");
  });

  it("rejects an invalid target size", () => {
    expect(() =>
      parseCompressFields({
        targetSize: "100",
        targetUnit: null,
        outputFormat: "original",
      })
    ).toThrow(AppError);

    try {
      parseCompressFields({
        targetSize: "nope",
        targetUnit: null,
        outputFormat: null,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_TARGET");
      expect((error as AppError).status).toBe(400);
    }
  });

  it("rejects an invalid target unit", () => {
    expect(() =>
      parseCompressFields({
        targetSize: String(100 * 1024),
        targetUnit: "GB",
        outputFormat: "original",
      })
    ).toThrow(AppError);
  });
});

describe("validateUpload", () => {
  it("rejects a missing/empty file", () => {
    const file = makeFile("empty.jpg", "image/jpeg", new Uint8Array());
    expect(() => validateUpload(file, Buffer.alloc(0))).toThrowError(/empty/i);
  });

  it("rejects unsupported formats even when the extension looks like an image", () => {
    const file = makeFile("notes.jpg", "image/jpeg", Buffer.from("not-an-image"));
    expect(() => validateUpload(file, Buffer.from("not-an-image"))).toThrow(AppError);

    try {
      validateUpload(file, Buffer.from("not-an-image"));
    } catch (error) {
      expect((error as AppError).code).toBe("INVALID_IMAGE");
    }
  });

  it("rejects files that are too large", () => {
    const oversized = Buffer.alloc(MAX_UPLOAD_BYTES + 1, 1);
    const file = makeFile("huge.jpg", "image/jpeg", oversized);

    try {
      validateUpload(file, oversized);
      throw new Error("expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("FILE_TOO_LARGE");
      expect((error as AppError).status).toBe(413);
    }
  });

  it("accepts a JPEG whose MIME type is generic octet-stream", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const file = makeFile("photo.jpg", "application/octet-stream", jpeg);
    expect(validateUpload(file, jpeg)).toEqual({
      declaredFormat: "jpeg",
      detectedFormat: "jpeg",
    });
  });

  it("accepts a JPEG with no file extension when the MIME type is image/jpeg", () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const file = makeFile("photo", "image/jpeg", jpeg);
    expect(validateUpload(file, jpeg)).toEqual({
      declaredFormat: "jpeg",
      detectedFormat: "jpeg",
    });
  });

  it("rejects a PNG signature that is missing the full magic bytes", () => {
    const fakePng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const file = makeFile("photo.png", "image/png", fakePng);

    try {
      validateUpload(file, fakePng);
      throw new Error("expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_IMAGE");
    }
  });

  it("rejects JPEG magic bytes that are not a decodable image", async () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);

    try {
      await assertValidImageContents(jpeg, "jpeg");
      throw new Error("expected validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("INVALID_IMAGE");
      expect((error as AppError).status).toBe(422);
    }
  });
});

describe("sanitizeStoredFileName", () => {
  it("strips path fragments from uploaded names", () => {
    expect(sanitizeStoredFileName("..\\..\\windows\\photo.jpg")).toBe("photo.jpg");
    expect(sanitizeStoredFileName("/etc/passwd.png")).toBe("passwd.png");
  });
});
