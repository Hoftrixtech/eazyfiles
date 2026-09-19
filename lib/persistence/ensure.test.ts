import { afterEach, describe, expect, it, vi } from "vitest";
import { allowMemoryPersistenceFallback, ensurePersistence, resetPersistenceModeForTests } from "@/lib/persistence/ensure";

const connectToDatabase = vi.fn();

vi.mock("@/lib/mongodb", () => ({
  isMongoConfigured: () => true,
  connectToDatabase: () => connectToDatabase(),
}));

describe("ensurePersistence", () => {
  afterEach(() => {
    resetPersistenceModeForTests();
    connectToDatabase.mockReset();
    delete process.env.PERSISTENCE_MODE;
    delete process.env.ALLOW_LOCAL_MEMORY_FALLBACK;
  });

  it("uses memory immediately when ALLOW_LOCAL_MEMORY_FALLBACK is true", async () => {
    process.env.ALLOW_LOCAL_MEMORY_FALLBACK = "true";
    const mode = await ensurePersistence();
    expect(mode).toBe("memory");
    expect(connectToDatabase).not.toHaveBeenCalled();
    expect(await ensurePersistence()).toBe("memory");
  });

  it("uses memory when MongoDB connect fails and fallback is allowed in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    connectToDatabase.mockRejectedValue(new Error("network"));
    const mode = await ensurePersistence();
    expect(mode).toBe("memory");
    expect(await ensurePersistence()).toBe("memory");
    vi.unstubAllEnvs();
  });

  it("rejects when MongoDB connect fails and fallback is disabled", async () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.ALLOW_LOCAL_MEMORY_FALLBACK = "false";
    connectToDatabase.mockRejectedValue(new Error("network"));
    await expect(ensurePersistence()).rejects.toThrow("network");
    vi.unstubAllEnvs();
  });

  it("allows memory fallback helper in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(allowMemoryPersistenceFallback()).toBe(true);
    vi.unstubAllEnvs();
  });
});
