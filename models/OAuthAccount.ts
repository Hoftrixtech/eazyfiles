import "server-only";

import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const oauthAccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    provider: { type: String, required: true, trim: true },
    providerAccountId: { type: String, required: true, trim: true },
    type: { type: String, required: true, default: "oauth" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

oauthAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
oauthAccountSchema.index({ userId: 1 });

export type OAuthAccountDocument = InferSchemaType<typeof oauthAccountSchema> & {
  userId: Types.ObjectId;
};

export const OAuthAccount: Model<OAuthAccountDocument> =
  (models.OAuthAccount as Model<OAuthAccountDocument> | undefined) ??
  model<OAuthAccountDocument>("OAuthAccount", oauthAccountSchema);
