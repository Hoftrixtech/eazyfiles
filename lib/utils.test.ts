import { describe, expect, it } from "vitest";
import { getFileExtension, sanitizeDownloadBase, sanitizeStoredFileName } from "@/lib/utils";

describe("getFileExtension", () => {
  it("returns the lowercase extension when a real extension exists", () => {
    expect(getFileExtension("photo.JPG")).toBe("jpg");
    expect(getFileExtension("archive.image.webp")).toBe("webp");
  });

  it("returns an empty string when there is no real extension", () => {
    expect(getFileExtension("photo")).toBe("");
    expect(getFileExtension(".gitignore")).toBe("");
    expect(getFileExtension("photo.")).toBe("");
  });
});

describe("sanitizeDownloadBase", () => {
  it("strips unsafe characters from download names", () => {
    expect(sanitizeDownloadBase("my photo.jpg")).toBe("my_photo");
    expect(sanitizeDownloadBase("../secret.png")).toBe("secret");
  });
});

describe("sanitizeStoredFileName", () => {
  it("strips path fragments from uploaded names", () => {
    expect(sanitizeStoredFileName("..\\..\\windows\\photo.jpg")).toBe("photo.jpg");
    expect(sanitizeStoredFileName("/etc/passwd.png")).toBe("passwd.png");
  });
});
