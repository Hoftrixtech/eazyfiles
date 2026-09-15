import "server-only";

import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const userTrialSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    toolSlug: { type: String, required: true, trim: true },
    used: { type: Boolean, required: true, default: false },
    usedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userTrialSchema.index({ userId: 1, toolSlug: 1 }, { unique: true });

export type UserTrialDocument = InferSchemaType<typeof userTrialSchema> & { userId: Types.ObjectId };

export const UserTrial: Model<UserTrialDocument> =
  (models.UserTrial as Model<UserTrialDocument> | undefined) ??
  model<UserTrialDocument>("UserTrial", userTrialSchema);
