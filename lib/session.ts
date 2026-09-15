import "server-only";

import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME } from "@/lib/constants";
import { createSessionId, isValidSessionId } from "@/lib/session-id";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(header: string | null, name: string): string | null {
  if (!header) {
    return null;
  }

  const parts = header.split(";");
  for (const part of parts) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = part.slice(0, separator).trim();
    if (key !== name) {
      continue;
    }

    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }

  return null;
}

export function resolveSessionId(request: Request): string {
  const cookieValue = readCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (cookieValue && isValidSessionId(cookieValue)) {
    return cookieValue;
  }

  const headerValue = request.headers.get(SESSION_HEADER_NAME)?.trim() ?? "";
  if (isValidSessionId(headerValue)) {
    return headerValue;
  }

  return createSessionId();
}

export function serializeSessionCookie(sessionId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax; HttpOnly${secure}`;
}

export function applySessionHeaders(headers: Headers, sessionId: string): void {
  headers.append("Set-Cookie", serializeSessionCookie(sessionId));
  headers.set("X-Session-Id", sessionId);
}
