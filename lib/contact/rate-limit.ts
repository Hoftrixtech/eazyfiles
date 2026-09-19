import "server-only";

import { createHash } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactRateLimit } from "@/models/ContactRateLimit";

export const CONTACT_RATE_LIMIT_MAX = 5;
export const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function rateLimitKey(ip: string): string {
  return createHash("sha256").update(`contact|${ip}`).digest("hex");
}

export async function isContactSubmissionBlocked(ip: string): Promise<boolean> {
  await connectToDatabase();
  const key = rateLimitKey(ip);
  const existing = await ContactRateLimit.findOne({ key }).lean();
  if (!existing) {
    return false;
  }

  const elapsed = Date.now() - new Date(existing.windowStartedAt).getTime();
  if (elapsed > CONTACT_RATE_LIMIT_WINDOW_MS) {
    return false;
  }

  return existing.submissionCount >= CONTACT_RATE_LIMIT_MAX;
}

export async function recordContactSubmission(ip: string): Promise<void> {
  await connectToDatabase();
  const key = rateLimitKey(ip);
  const now = new Date();
  const existing = await ContactRateLimit.findOne({ key });

  if (!existing || Date.now() - existing.windowStartedAt.getTime() > CONTACT_RATE_LIMIT_WINDOW_MS) {
    await ContactRateLimit.findOneAndUpdate(
      { key },
      { $set: { submissionCount: 1, windowStartedAt: now } },
      { upsert: true }
    );
    return;
  }

  await ContactRateLimit.updateOne({ key }, { $inc: { submissionCount: 1 } });
}
