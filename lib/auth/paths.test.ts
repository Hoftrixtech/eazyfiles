import { describe, expect, it } from "vitest";
import { postAuthRedirectPath, safeNextPath, withNextParam } from "@/lib/auth/paths";

describe("safeNextPath", () => {
  it("allows internal paths", () => {
    expect(safeNextPath("/tools/image-resizer")).toBe("/tools/image-resizer");
  });

  it("rejects protocol-relative and external values", () => {
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("/\\evil")).toBe("/");
  });

  it("builds login links with a next param", () => {
    expect(withNextParam("/login", "/tools/image-cropper")).toBe(
      "/login?next=%2Ftools%2Fimage-cropper"
    );
  });
});

describe("postAuthRedirectPath", () => {
  it("defaults to the dashboard when next is missing or root", () => {
    expect(postAuthRedirectPath(undefined)).toBe("/account");
    expect(postAuthRedirectPath("/")).toBe("/account");
  });

  it("preserves explicit internal next paths", () => {
    expect(postAuthRedirectPath("/tools")).toBe("/tools");
  });
});
