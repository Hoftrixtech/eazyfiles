import { afterEach, describe, expect, it, vi } from "vitest";
import { ensureAuthEnv } from "@/lib/auth/ensure-auth-env";

describe("ensureAuthEnv", () => {
  afterEach(() => {
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
    vi.unstubAllEnvs();
  });

  it("sets localhost AUTH_URL in development when unset", () => {
    vi.stubEnv("NODE_ENV", "development");
    ensureAuthEnv();
    expect(process.env.AUTH_URL).toBe("http://localhost:3000");
  });

  it("does not override an existing AUTH_URL", () => {
    vi.stubEnv("NODE_ENV", "development");
    process.env.AUTH_URL = "http://example.test";
    ensureAuthEnv();
    expect(process.env.AUTH_URL).toBe("http://example.test");
  });

  it("rewrites 0.0.0.0 AUTH_URL to localhost", () => {
    process.env.AUTH_URL = "https://0.0.0.0:3000";
    ensureAuthEnv();
    expect(process.env.AUTH_URL).toBe("http://localhost:3000");
  });
});
