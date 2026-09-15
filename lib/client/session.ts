import { SESSION_STORAGE_KEY } from "@/lib/constants";
import { createSessionId, isValidSessionId } from "@/lib/session-id";

export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && isValidSessionId(existing)) {
      return existing;
    }

    const sessionId = createSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  } catch {
    return createSessionId();
  }
}

export function persistAnonymousSessionId(sessionId: string): void {
  if (typeof window === "undefined" || !isValidSessionId(sessionId)) {
    return;
  }

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch {
    // Storage can be unavailable in private browsing modes.
  }
}
