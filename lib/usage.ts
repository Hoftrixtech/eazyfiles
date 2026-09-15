import "server-only";

import { DAILY_COMPRESSION_LIMIT } from "@/lib/constants";
import { ensurePersistence, isMemoryPersistence } from "@/lib/persistence/ensure";
import {
  memoryGetTodayCompressionCount,
  memoryReleaseUsageSlot,
  memoryReserveUsageSlot,
} from "@/lib/persistence/memory-store";
import { connectToDatabase } from "@/lib/mongodb";
import { Usage } from "@/models/Usage";

export function utcUsageDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function secondsUntilUtcMidnight(date = new Date()): number {
  const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return Math.max(1, Math.ceil((next - date.getTime()) / 1000));
}

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}

export async function getTodayCompressionCount(sessionId: string): Promise<number> {
  await ensurePersistence();
  if (isMemoryPersistence()) {
    return memoryGetTodayCompressionCount(sessionId, utcUsageDate());
  }
  await connectToDatabase();
  const usage = await Usage.findOne({ sessionId, date: utcUsageDate() }).lean();
  return usage?.compressionCount ?? 0;
}

export async function reserveUsageSlot(
  sessionId: string,
  limit: number = DAILY_COMPRESSION_LIMIT
): Promise<boolean> {
  await ensurePersistence();
  const date = utcUsageDate();
  if (isMemoryPersistence()) {
    return memoryReserveUsageSlot(sessionId, date, limit);
  }
  await connectToDatabase();

  try {
    const updated = await Usage.findOneAndUpdate(
      {
        sessionId,
        date,
        compressionCount: { $lt: limit },
      },
      {
        $inc: { compressionCount: 1 },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true }
    );

    return updated !== null && updated.compressionCount <= limit;
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    const retry = await Usage.findOneAndUpdate(
      {
        sessionId,
        date,
        compressionCount: { $lt: limit },
      },
      { $inc: { compressionCount: 1 } },
      { new: true }
    );

    return retry !== null;
  }
}

export async function releaseUsageSlot(sessionId: string): Promise<void> {
  try {
    await ensurePersistence();
    const date = utcUsageDate();
    if (isMemoryPersistence()) {
      memoryReleaseUsageSlot(sessionId, date);
      return;
    }
    await connectToDatabase();
    await Usage.findOneAndUpdate(
      {
        sessionId,
        date: utcUsageDate(),
        compressionCount: { $gt: 0 },
      },
      { $inc: { compressionCount: -1 } }
    );
  } catch {
    // Releasing a reserved slot must never leak database details.
  }
}
