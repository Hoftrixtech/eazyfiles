import "server-only";

import { cookies } from "next/headers";
import { authenticatedUsageSubject } from "@/lib/access/tools";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { ensurePersistence, isMemoryPersistence } from "@/lib/persistence/ensure";
import { memoryGetTotalCompressionCount } from "@/lib/persistence/memory-store";
import { connectToDatabase } from "@/lib/mongodb";
import { isValidSessionId } from "@/lib/session-id";
import { getTodayCompressionCount } from "@/lib/usage";
import { CompressionJob } from "@/models/CompressionJob";
import { Usage } from "@/models/Usage";
import type { JobStatus } from "@/types/compression";

export type DashboardCompressionActivity = {
  id: string;
  fileName: string;
  toolLabel: "Image Compressor";
  originalSize: number;
  outputSize: number;
  status: JobStatus;
  createdAt: Date;
};

export type DashboardStats = {
  compressionsToday: number;
  compressionsTodayLimit: number;
  totalCompressions: number | null;
  activeDaysWithUsage: number | null;
  recentCompressions: DashboardCompressionActivity[];
  /** True when compression jobs are scoped to this browser session only (not user-id in DB). */
  recentActivitySessionScoped: boolean;
  persistenceAvailable: boolean;
};

async function readBrowserSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!value || !isValidSessionId(value)) {
    return null;
  }
  return value;
}

async function getTotalCompressionsForUser(userId: string): Promise<{ total: number; activeDays: number } | null> {
  const subject = authenticatedUsageSubject(userId);
  await ensurePersistence();
  if (isMemoryPersistence()) {
    const total = memoryGetTotalCompressionCount(subject);
    return {
      total,
      activeDays: total > 0 ? 1 : 0,
    };
  }

  try {
    await connectToDatabase();
    const rows = await Usage.find({ sessionId: subject }).select("compressionCount date").lean();
    let total = 0;
    for (const row of rows) {
      total += row.compressionCount ?? 0;
    }
    return { total, activeDays: rows.length };
  } catch {
    return null;
  }
}

async function getRecentCompressionJobs(browserSessionId: string | null): Promise<DashboardCompressionActivity[]> {
  if (!browserSessionId) {
    return [];
  }

  await ensurePersistence();
  if (isMemoryPersistence()) {
    return [];
  }

  try {
    await connectToDatabase();
    const jobs = await CompressionJob.find({ sessionId: browserSessionId })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("originalFileName originalSize compressedSize status createdAt")
      .lean();

    return jobs.map((job) => ({
      id: String(job._id),
      fileName: job.originalFileName,
      toolLabel: "Image Compressor",
      originalSize: job.originalSize,
      outputSize: job.compressedSize,
      status: job.status as JobStatus,
      createdAt: job.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function getDashboardStats(
  userId: string,
  compressionsTodayLimit: number
): Promise<DashboardStats> {
  let persistenceAvailable = true;
  let compressionsToday = 0;
  let totals: { total: number; activeDays: number } | null = null;

  try {
    await ensurePersistence();
    compressionsToday = await getTodayCompressionCount(authenticatedUsageSubject(userId));
    totals = await getTotalCompressionsForUser(userId);
  } catch {
    persistenceAvailable = false;
  }

  const browserSessionId = await readBrowserSessionId();
  const recentCompressions = persistenceAvailable ? await getRecentCompressionJobs(browserSessionId) : [];

  return {
    compressionsToday,
    compressionsTodayLimit,
    totalCompressions: totals?.total ?? null,
    activeDaysWithUsage: totals?.activeDays ?? null,
    recentCompressions,
    recentActivitySessionScoped: true,
    persistenceAvailable,
  };
}
