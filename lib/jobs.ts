import "server-only";

import { ensurePersistence, isMemoryPersistence } from "@/lib/persistence/ensure";
import { memoryCreateJobId } from "@/lib/persistence/memory-store";
import { connectToDatabase } from "@/lib/mongodb";
import { CompressionJob } from "@/models/CompressionJob";
import type { JobStatus, SupportedImageFormat } from "@/types/compression";

interface CreateJobInput {
  sessionId: string;
  originalFileName: string;
  originalFormat: SupportedImageFormat | "unknown";
  outputFormat: SupportedImageFormat | "unknown";
  originalSize: number;
  targetSize: number;
}

export async function createProcessingJob(input: CreateJobInput): Promise<string> {
  await ensurePersistence();
  if (isMemoryPersistence()) {
    return memoryCreateJobId();
  }
  await connectToDatabase();
  const job = await CompressionJob.create({
    ...input,
    compressedSize: 0,
    compressionPercentage: 0,
    status: "processing" satisfies JobStatus,
  });

  return String(job._id);
}

export async function completeJob(
  jobId: string,
  input: {
    compressedSize: number;
    compressionPercentage: number;
    outputFormat: SupportedImageFormat | "unknown";
  }
): Promise<void> {
  await ensurePersistence();
  if (isMemoryPersistence()) {
    return;
  }
  await connectToDatabase();
  await CompressionJob.findByIdAndUpdate(
    jobId,
    {
      compressedSize: input.compressedSize,
      compressionPercentage: input.compressionPercentage,
      outputFormat: input.outputFormat,
      status: "completed" satisfies JobStatus,
    },
    { runValidators: true }
  );
}

export async function failJob(jobId: string | null): Promise<void> {
  if (!jobId) {
    return;
  }

  try {
    await ensurePersistence();
    if (isMemoryPersistence()) {
      return;
    }
    await connectToDatabase();
    await CompressionJob.findByIdAndUpdate(jobId, {
      status: "failed" satisfies JobStatus,
    });
  } catch {
    // Job status updates must never leak database details.
  }
}
