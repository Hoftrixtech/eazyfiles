import { describe, expect, it } from "vitest";
import { getUserEntitlement } from "@/lib/access/entitlement";

describe("getUserEntitlement", () => {
  it("returns the free plan when no user is signed in", async () => {
    await expect(getUserEntitlement(null)).resolves.toEqual({
      userId: null,
      planId: "free",
      status: "free",
    });
  });

  it("returns free for authenticated users at launch", async () => {
    await expect(getUserEntitlement("64b0f0f0f0f0f0f0f0f0f0f0")).resolves.toEqual({
      userId: "64b0f0f0f0f0f0f0f0f0f0f0",
      planId: "free",
      status: "free",
    });
  });
});
