import { beforeEach, describe, expect, it, vi } from "vitest";
import { ANONYMOUS_COMPRESSOR_LIMIT } from "@/lib/constants";

const store = new Map<string, { compressorCount: number }>();

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: vi.fn(async () => ({})),
  isMongoConfigured: vi.fn(() => true),
}));

vi.mock("@/models/AnonymousUsage", () => ({
  AnonymousUsage: {
    findOne: vi.fn((filter: { sessionId: string }) => ({
      lean: async () => {
        const current = store.get(filter.sessionId);
        return current ? { compressorCount: current.compressorCount } : null;
      },
    })),
    findOneAndUpdate: vi.fn(
      async (
        filter: { sessionId: string; compressorCount?: { $lt?: number; $gt?: number } },
        update: { $inc?: { compressorCount: number } },
        options?: { upsert?: boolean }
      ) => {
        const current = store.get(filter.sessionId) ?? { compressorCount: 0 };
        const exists = store.has(filter.sessionId);
        const lt = filter.compressorCount?.$lt;
        const gt = filter.compressorCount?.$gt;

        if (typeof lt === "number" && current.compressorCount >= lt) {
          if (options?.upsert && !exists) {
            const next = { compressorCount: current.compressorCount + (update.$inc?.compressorCount ?? 0) };
            store.set(filter.sessionId, next);
            return next;
          }
          if (options?.upsert && exists) {
            const error = new Error("duplicate") as Error & { code: number };
            error.code = 11000;
            throw error;
          }
          return null;
        }

        if (typeof gt === "number" && current.compressorCount <= gt) {
          return null;
        }

        const nextCount = current.compressorCount + (update.$inc?.compressorCount ?? 0);
        const next = { compressorCount: nextCount };
        store.set(filter.sessionId, next);
        return next;
      }
    ),
  },
}));

const { resetPersistenceModeForTests } = await import("@/lib/persistence/ensure");
const { getAnonymousCompressorCount, releaseAnonymousCompressor, reserveAnonymousCompressor } = await import(
  "@/lib/access/anonymous-compress"
);

describe("anonymous compressor lifetime limit", () => {
  const sessionId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    resetPersistenceModeForTests();
    store.clear();
  });

  it("allows 5 compressions for a session", async () => {
    for (let i = 0; i < ANONYMOUS_COMPRESSOR_LIMIT; i += 1) {
      expect(await reserveAnonymousCompressor(sessionId)).toBe(true);
    }

    expect(await getAnonymousCompressorCount(sessionId)).toBe(ANONYMOUS_COMPRESSOR_LIMIT);
  });

  it("rejects the 6th compression", async () => {
    for (let i = 0; i < ANONYMOUS_COMPRESSOR_LIMIT; i += 1) {
      await reserveAnonymousCompressor(sessionId);
    }

    expect(await reserveAnonymousCompressor(sessionId)).toBe(false);
    expect(await getAnonymousCompressorCount(sessionId)).toBe(ANONYMOUS_COMPRESSOR_LIMIT);
  });

  it("does not consume a use when processing fails and the slot is released", async () => {
    expect(await reserveAnonymousCompressor(sessionId)).toBe(true);
    await releaseAnonymousCompressor(sessionId);
    expect(await getAnonymousCompressorCount(sessionId)).toBe(0);
    expect(await reserveAnonymousCompressor(sessionId)).toBe(true);
  });
});
