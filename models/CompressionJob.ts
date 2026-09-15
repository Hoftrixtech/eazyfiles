import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import type { JobStatus } from "@/types/compression";

const compressionJobSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    originalFileName: { type: String, required: true, trim: true, maxlength: 120 },
    originalFormat: { type: String, required: true, trim: true },
    outputFormat: { type: String, required: true, trim: true },
    originalSize: { type: Number, required: true, min: 0 },
    compressedSize: { type: Number, required: true, min: 0, default: 0 },
    targetSize: { type: Number, required: true, min: 0 },
    compressionPercentage: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "failed"] satisfies JobStatus[],
      default: "processing",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

compressionJobSchema.index({ createdAt: -1 });
compressionJobSchema.index({ sessionId: 1, createdAt: -1 });

export type CompressionJobDocument = InferSchemaType<typeof compressionJobSchema>;

export const CompressionJob: Model<CompressionJobDocument> =
  (models.CompressionJob as Model<CompressionJobDocument> | undefined) ??
  model<CompressionJobDocument>("CompressionJob", compressionJobSchema);
