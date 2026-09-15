import "server-only";

import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const entitlementSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    planId: { type: String, required: true, enum: ["free", "premium"], default: "free" },
    status: {
      type: String,
      required: true,
      enum: ["free", "active", "cancelled", "expired"],
      default: "free",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

entitlementSchema.index({ userId: 1 }, { unique: true });

export type EntitlementDocument = InferSchemaType<typeof entitlementSchema> & { userId: Types.ObjectId };

export const Entitlement: Model<EntitlementDocument> =
  (models.Entitlement as Model<EntitlementDocument> | undefined) ??
  model<EntitlementDocument>("Entitlement", entitlementSchema);
