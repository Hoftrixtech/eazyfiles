import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withTempDirectory } from "@/lib/compression/temp-files";

describe("temporary file cleanup", () => {
  it("removes the temp directory after success", async () => {
    let directory = "";

    await withTempDirectory(async (dir) => {
      directory = dir;
      await writeFile(path.join(dir, "input.jpg"), Buffer.from("abc"));
      return true;
    });

    await expect(access(directory)).rejects.toThrow();
  });

  it("removes the temp directory after failure", async () => {
    let directory = "";

    await expect(
      withTempDirectory(async (dir) => {
        directory = dir;
        await writeFile(path.join(dir, "input.jpg"), Buffer.from("abc"));
        throw new Error("compression failed");
      })
    ).rejects.toThrow("compression failed");

    await expect(access(directory)).rejects.toThrow();
  });
});
