import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const loginAttemptSchema = new Schema(
  {
    key: { type: String, required: true },
    failedCount: { type: Number, required: true, default: 0, min: 0 },
    windowStartedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

loginAttemptSchema.index({ key: 1 }, { unique: true });
loginAttemptSchema.index({ windowStartedAt: 1 }, { expireAfterSeconds: 60 * 60 });

export type LoginAttemptDocument = InferSchemaType<typeof loginAttemptSchema>;

export const LoginAttempt: Model<LoginAttemptDocument> =
  (models.LoginAttempt as Model<LoginAttemptDocument> | undefined) ??
  model<LoginAttemptDocument>("LoginAttempt", loginAttemptSchema);
