import { describe, expect, it } from "vitest";
import { createSessionId, isValidSessionId } from "@/lib/session-id";
import { resolveSessionId } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

describe("anonymous session IDs", () => {
  it("creates a valid UUID v4", () => {
    const sessionId = createSessionId();
    expect(isValidSessionId(sessionId)).toBe(true);
  });

  it("rejects non-UUID values", () => {
    expect(isValidSessionId("")).toBe(false);
    expect(isValidSessionId("user@example.com")).toBe(false);
    expect(isValidSessionId("not-a-session")).toBe(false);
  });

  it("reuses a valid cookie session", () => {
    const sessionId = createSessionId();
    const request = new Request("http://localhost/api/compress", {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${sessionId}` },
    });

    expect(resolveSessionId(request)).toBe(sessionId);
  });

  it("reuses a valid header session when no cookie is present", () => {
    const sessionId = createSessionId();
    const request = new Request("http://localhost/api/compress", {
      headers: { "x-session-id": sessionId },
    });

    expect(resolveSessionId(request)).toBe(sessionId);
  });

  it("issues a new session when the provided value is invalid", () => {
    const request = new Request("http://localhost/api/compress", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=abc`,
        "x-session-id": "also-invalid",
      },
    });

    expect(isValidSessionId(resolveSessionId(request))).toBe(true);
  });
});
