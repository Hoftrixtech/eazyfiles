import { describe, expect, it } from "vitest";
import { allowsFutureAds } from "@/lib/ads/policy";

describe("ads policy", () => {
  it("only allows future ads on public surfaces", () => {
    expect(allowsFutureAds({ surface: "public" })).toBe(true);
    expect(allowsFutureAds({ surface: "account" })).toBe(false);
    expect(allowsFutureAds({ surface: "auth" })).toBe(false);
  });
});
