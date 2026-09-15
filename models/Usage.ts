import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const usageSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    compressionCount: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

usageSchema.index({ sessionId: 1, date: 1 }, { unique: true });

export type UsageDocument = InferSchemaType<typeof usageSchema>;

export const Usage: Model<UsageDocument> =
  (models.Usage as Model<UsageDocument> | undefined) ??
  model<UsageDocument>("Usage", usageSchema);
