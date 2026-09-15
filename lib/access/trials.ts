import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { UserTrial } from "@/models/UserTrial";
import type { PremiumImageTool } from "@/types/access";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}

export async function getTrialUsed(userId: string, toolSlug: PremiumImageTool): Promise<boolean> {
  await connectToDatabase();
  const trial = await UserTrial.findOne({ userId, toolSlug }).lean();
  return Boolean(trial?.used);
}

export async function getTrialMap(
  userId: string,
  tools: readonly PremiumImageTool[]
): Promise<Record<PremiumImageTool, boolean>> {
  await connectToDatabase();
  const rows = await UserTrial.find({ userId, toolSlug: { $in: [...tools] } }).lean();
  const used = Object.fromEntries(tools.map((tool) => [tool, false])) as Record<PremiumImageTool, boolean>;
  for (const row of rows) {
    if (row.toolSlug in used) {
      used[row.toolSlug as PremiumImageTool] = Boolean(row.used);
    }
  }
  return used;
}

export async function reserveTrial(userId: string, toolSlug: PremiumImageTool): Promise<boolean> {
  await connectToDatabase();

  try {
    const updated = await UserTrial.findOneAndUpdate(
      {
        userId,
        toolSlug,
        used: { $ne: true },
      },
      {
        $set: { used: true, usedAt: new Date() },
        $setOnInsert: { userId, toolSlug },
      },
      { upsert: true, new: true }
    );

    return updated !== null && updated.used === true;
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    return false;
  }
}

export async function releaseTrial(userId: string, toolSlug: PremiumImageTool): Promise<void> {
  try {
    await connectToDatabase();
    await UserTrial.findOneAndUpdate(
      { userId, toolSlug, used: true },
      { $set: { used: false }, $unset: { usedAt: 1 } }
    );
  } catch {
    // Releasing a reserved trial must never leak database details.
  }
}
