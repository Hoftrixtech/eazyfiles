import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const contactRateLimitSchema = new Schema(
  {
    key: { type: String, required: true },
    submissionCount: { type: Number, required: true, default: 0, min: 0 },
    windowStartedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactRateLimitSchema.index({ key: 1 }, { unique: true });
contactRateLimitSchema.index({ windowStartedAt: 1 }, { expireAfterSeconds: 60 * 60 * 6 });

export type ContactRateLimitDocument = InferSchemaType<typeof contactRateLimitSchema>;

export const ContactRateLimit: Model<ContactRateLimitDocument> =
  (models.ContactRateLimit as Model<ContactRateLimitDocument> | undefined) ??
  model<ContactRateLimitDocument>("ContactRateLimit", contactRateLimitSchema);
