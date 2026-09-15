import "server-only";

import { ANONYMOUS_COMPRESSOR_LIMIT } from "@/lib/constants";
import { ensurePersistence, isMemoryPersistence } from "@/lib/persistence/ensure";
import {
  memoryGetAnonymousCompressorCount,
  memoryReleaseAnonymousCompressor,
  memoryReserveAnonymousCompressor,
} from "@/lib/persistence/memory-store";
import { connectToDatabase } from "@/lib/mongodb";
import { AnonymousUsage } from "@/models/AnonymousUsage";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}

export async function getAnonymousCompressorCount(sessionId: string): Promise<number> {
  await ensurePersistence();
  if (isMemoryPersistence()) {
    return memoryGetAnonymousCompressorCount(sessionId);
  }
  await connectToDatabase();
  const usage = await AnonymousUsage.findOne({ sessionId }).lean();
  return usage?.compressorCount ?? 0;
}

export async function reserveAnonymousCompressor(sessionId: string): Promise<boolean> {
  await ensurePersistence();
  if (isMemoryPersistence()) {
    return memoryReserveAnonymousCompressor(sessionId, ANONYMOUS_COMPRESSOR_LIMIT);
  }
  await connectToDatabase();

  try {
    const updated = await AnonymousUsage.findOneAndUpdate(
      {
        sessionId,
        compressorCount: { $lt: ANONYMOUS_COMPRESSOR_LIMIT },
      },
      {
        $inc: { compressorCount: 1 },
        $setOnInsert: { sessionId },
      },
      { upsert: true, new: true }
    );

    return updated !== null && updated.compressorCount <= ANONYMOUS_COMPRESSOR_LIMIT;
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    const retry = await AnonymousUsage.findOneAndUpdate(
      {
        sessionId,
        compressorCount: { $lt: ANONYMOUS_COMPRESSOR_LIMIT },
      },
      { $inc: { compressorCount: 1 } },
      { new: true }
    );

    return retry !== null;
  }
}

export async function releaseAnonymousCompressor(sessionId: string): Promise<void> {
  try {
    await ensurePersistence();
    if (isMemoryPersistence()) {
      memoryReleaseAnonymousCompressor(sessionId);
      return;
    }
    await connectToDatabase();
    await AnonymousUsage.findOneAndUpdate(
      {
        sessionId,
        compressorCount: { $gt: 0 },
      },
      { $inc: { compressorCount: -1 } }
    );
  } catch {
    // Releasing a reserved slot must never leak database details.
  }
}
