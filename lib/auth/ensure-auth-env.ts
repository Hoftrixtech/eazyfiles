/**
 * Auth.js builds callback URLs from AUTH_URL. Without it, dev may infer
 * https://0.0.0.0:3000 when the server binds to all interfaces.
 */
function normalizeAuthUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");
  if (trimmed.includes("0.0.0.0")) {
    return "http://localhost:3000";
  }
  return trimmed;
}

export function ensureAuthEnv(): void {
  const existing = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (existing) {
    process.env.AUTH_URL = normalizeAuthUrl(existing);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    process.env.AUTH_URL = "http://localhost:3000";
  }
}
