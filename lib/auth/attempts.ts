import "server-only";

import { createHash } from "node:crypto";
import { LOGIN_MAX_FAILURES, LOGIN_WINDOW_MS } from "@/lib/constants";
import { connectToDatabase } from "@/lib/mongodb";
import { LoginAttempt } from "@/models/LoginAttempt";

function attemptKey(kind: "login" | "register", email: string, ip: string): string {
  return createHash("sha256").update(`${kind}|${ip}|${email}`).digest("hex");
}

export function clientIpFromHeaders(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function isAuthAttemptBlocked(
  kind: "login" | "register",
  email: string,
  ip: string
): Promise<boolean> {
  await connectToDatabase();
  const key = attemptKey(kind, email, ip);
  const existing = await LoginAttempt.findOne({ key }).lean();
  if (!existing) {
    return false;
  }

  const elapsed = Date.now() - new Date(existing.windowStartedAt).getTime();
  if (elapsed > LOGIN_WINDOW_MS) {
    return false;
  }

  return existing.failedCount >= LOGIN_MAX_FAILURES;
}

export async function recordFailedAuthAttempt(
  kind: "login" | "register",
  email: string,
  ip: string
): Promise<void> {
  await connectToDatabase();
  const key = attemptKey(kind, email, ip);
  const now = new Date();
  const existing = await LoginAttempt.findOne({ key });

  if (!existing || Date.now() - existing.windowStartedAt.getTime() > LOGIN_WINDOW_MS) {
    await LoginAttempt.findOneAndUpdate(
      { key },
      { $set: { failedCount: 1, windowStartedAt: now } },
      { upsert: true }
    );
    return;
  }

  await LoginAttempt.updateOne({ key }, { $inc: { failedCount: 1 } });
}

export async function clearAuthAttempts(
  kind: "login" | "register",
  email: string,
  ip: string
): Promise<void> {
  try {
    await connectToDatabase();
    await LoginAttempt.deleteOne({ key: attemptKey(kind, email, ip) });
  } catch {
    // Clearing attempt state must never leak database details.
  }
}
