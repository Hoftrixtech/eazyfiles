import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, { used: boolean }>();

function keyFor(userId: string, toolSlug: string): string {
  return `${userId}:${toolSlug}`;
}

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: vi.fn(async () => ({})),
}));

vi.mock("@/models/UserTrial", () => ({
  UserTrial: {
    findOne: vi.fn((filter: { userId: string; toolSlug: string }) => ({
      lean: async () => {
        const current = store.get(keyFor(filter.userId, filter.toolSlug));
        return current ? { used: current.used } : null;
      },
    })),
    find: vi.fn((filter: { userId: string; toolSlug: { $in: string[] } }) => ({
      lean: async () =>
        filter.toolSlug.$in
          .map((toolSlug) => {
            const current = store.get(keyFor(filter.userId, toolSlug));
            return current ? { toolSlug, used: current.used } : null;
          })
          .filter(Boolean),
    })),
    findOneAndUpdate: vi.fn(
      async (
        filter: { userId: string; toolSlug: string; used?: boolean | { $ne?: boolean } },
        update: { $set?: { used?: boolean } }
      ) => {
        const key = keyFor(filter.userId, filter.toolSlug);
        const current = store.get(key);

        if (filter.used && typeof filter.used === "object" && filter.used.$ne === true) {
          if (current?.used) {
            const error = new Error("duplicate") as Error & { code: number };
            error.code = 11000;
            throw error;
          }

          store.set(key, { used: true });
          return { used: true };
        }

        if (filter.used === true) {
          if (!current?.used) {
            return null;
          }
          store.set(key, { used: Boolean(update.$set?.used) });
          return store.get(key);
        }

        return null;
      }
    ),
  },
}));

const { getTrialUsed, releaseTrial, reserveTrial } = await import("@/lib/access/trials");

describe("premium tool trials", () => {
  const userId = "64b0f0f0f0f0f0f0f0f0f0f0";

  beforeEach(() => {
    store.clear();
  });

  it("allows the first successful reserve", async () => {
    expect(await reserveTrial(userId, "image-resizer")).toBe(true);
    expect(await getTrialUsed(userId, "image-resizer")).toBe(true);
  });

  it("rejects a second reserve for the same tool", async () => {
    expect(await reserveTrial(userId, "image-resizer")).toBe(true);
    expect(await reserveTrial(userId, "image-resizer")).toBe(false);
    expect(await getTrialUsed(userId, "image-cropper")).toBe(false);
  });

  it("restores the trial when processing fails", async () => {
    expect(await reserveTrial(userId, "image-converter")).toBe(true);
    await releaseTrial(userId, "image-converter");
    expect(await getTrialUsed(userId, "image-converter")).toBe(false);
    expect(await reserveTrial(userId, "image-converter")).toBe(true);
  });
});
