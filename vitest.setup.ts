import { vi } from "vitest";

process.env.AUTH_SECRET ??= "test-auth-secret-test-auth-secret-test-32";

vi.mock("server-only", () => ({}));
