import { beforeEach, describe, expect, it, vi } from "vitest";
import { DAILY_COMPRESSION_LIMIT } from "@/lib/constants";

const store = new Map<string, { compressionCount: number }>();

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: vi.fn(async () => ({})),
  isMongoConfigured: vi.fn(() => true),
}));

vi.mock("@/models/Usage", () => ({
  Usage: {
    findOne: vi.fn((filter: { sessionId: string; date: string }) => ({
      lean: async () => {
        const current = store.get(`${filter.sessionId}:${filter.date}`);
        return current ? { compressionCount: current.compressionCount } : null;
      },
    })),
    findOneAndUpdate: vi.fn(
      async (
        filter: { sessionId: string; date: string; compressionCount?: { $lt?: number; $gt?: number } },
        update: { $inc?: { compressionCount: number } }
      ) => {
        const key = `${filter.sessionId}:${filter.date}`;
        const current = store.get(key) ?? { compressionCount: 0 };
        const lt = filter.compressionCount?.$lt;
        const gt = filter.compressionCount?.$gt;

        if (typeof lt === "number" && current.compressionCount >= lt) {
          return null;
        }

        if (typeof gt === "number" && current.compressionCount <= gt) {
          return null;
        }

        const nextCount = current.compressionCount + (update.$inc?.compressionCount ?? 0);
        const next = { compressionCount: nextCount };
        store.set(key, next);
        return next;
      }
    ),
  },
}));

const { getTodayCompressionCount, releaseUsageSlot, reserveUsageSlot } = await import("@/lib/usage");

describe("daily usage limiter", () => {
  const sessionId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    store.clear();
  });

  it("counts compressions for a session/day", async () => {
    expect(await getTodayCompressionCount(sessionId)).toBe(0);
    expect(await reserveUsageSlot(sessionId)).toBe(true);
    expect(await getTodayCompressionCount(sessionId)).toBe(1);
  });

  it("allows the configured daily compression limit", async () => {
    for (let i = 0; i < DAILY_COMPRESSION_LIMIT; i += 1) {
      expect(await reserveUsageSlot(sessionId)).toBe(true);
    }

    expect(await getTodayCompressionCount(sessionId)).toBe(DAILY_COMPRESSION_LIMIT);
  });

  it("rejects beyond the daily compression limit", async () => {
    for (let i = 0; i < DAILY_COMPRESSION_LIMIT; i += 1) {
      await reserveUsageSlot(sessionId);
    }

    expect(await reserveUsageSlot(sessionId)).toBe(false);
    expect(await getTodayCompressionCount(sessionId)).toBe(DAILY_COMPRESSION_LIMIT);
  });

  it("honors a caller-supplied daily limit from the plan", async () => {
    expect(await reserveUsageSlot(sessionId, 2)).toBe(true);
    expect(await reserveUsageSlot(sessionId, 2)).toBe(true);
    expect(await reserveUsageSlot(sessionId, 2)).toBe(false);
  });

  it("releases a reserved slot after a failed compression", async () => {
    await reserveUsageSlot(sessionId);
    await releaseUsageSlot(sessionId);
    expect(await getTodayCompressionCount(sessionId)).toBe(0);
    expect(await reserveUsageSlot(sessionId)).toBe(true);
  });
});
