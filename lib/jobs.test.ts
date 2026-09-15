import { beforeEach, describe, expect, it, vi } from "vitest";

const create = vi.fn();
const findByIdAndUpdate = vi.fn();

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: vi.fn(async () => ({})),
  isMongoConfigured: vi.fn(() => true),
}));

vi.mock("@/models/CompressionJob", () => ({
  CompressionJob: {
    create,
    findByIdAndUpdate,
  },
}));

const { resetPersistenceModeForTests } = await import("@/lib/persistence/ensure");
const { completeJob, createProcessingJob, failJob } = await import("@/lib/jobs");

describe("CompressionJob helpers", () => {
  beforeEach(() => {
    resetPersistenceModeForTests();
    create.mockReset();
    findByIdAndUpdate.mockReset();
  });

  it("creates a processing job without storing image bytes", async () => {
    create.mockResolvedValue({ _id: "job-1" });

    const jobId = await createProcessingJob({
      sessionId: "11111111-1111-4111-8111-111111111111",
      originalFileName: "photo.jpg",
      originalFormat: "jpeg",
      outputFormat: "jpeg",
      originalSize: 2048,
      targetSize: 1024,
    });

    expect(jobId).toBe("job-1");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "processing",
        originalFileName: "photo.jpg",
        originalSize: 2048,
        compressedSize: 0,
      })
    );
    expect(JSON.stringify(create.mock.calls[0]?.[0])).not.toMatch(/ffd8|image binary|Buffer/);
  });

  it("marks a job completed with compressed metadata", async () => {
    findByIdAndUpdate.mockResolvedValue({});
    await completeJob("job-1", {
      compressedSize: 900,
      compressionPercentage: 56,
      outputFormat: "jpeg",
    });

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      "job-1",
      expect.objectContaining({
        status: "completed",
        compressedSize: 900,
      }),
      { runValidators: true }
    );
  });

  it("marks a job failed", async () => {
    findByIdAndUpdate.mockResolvedValue({});
    await failJob("job-1");
    expect(findByIdAndUpdate).toHaveBeenCalledWith("job-1", { status: "failed" });
  });
});
