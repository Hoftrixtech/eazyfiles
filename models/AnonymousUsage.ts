import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const anonymousUsageSchema = new Schema(
  {
    sessionId: { type: String, required: true },
    compressorCount: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

anonymousUsageSchema.index({ sessionId: 1 }, { unique: true });

export type AnonymousUsageDocument = InferSchemaType<typeof anonymousUsageSchema>;

export const AnonymousUsage: Model<AnonymousUsageDocument> =
  (models.AnonymousUsage as Model<AnonymousUsageDocument> | undefined) ??
  model<AnonymousUsageDocument>("AnonymousUsage", anonymousUsageSchema);
