import { describe, expect, it } from "vitest";
import { hasPremiumAccess, resolveEffectivePlanId } from "@/lib/plans/entitlement";

describe("entitlement helpers at launch", () => {
  it("never grants premium access", () => {
    expect(hasPremiumAccess({ userId: "u1", planId: "premium", status: "active" })).toBe(false);
    expect(hasPremiumAccess({ userId: "u1", planId: "free", status: "free" })).toBe(false);
  });

  it("always resolves the free plan id for access", () => {
    expect(resolveEffectivePlanId({ userId: "u1", planId: "premium", status: "active" })).toBe("free");
  });
});
