import "server-only";

import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

export type AuthProviderId = "credentials" | "google";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    /** Optional for OAuth-only accounts. Never returned to the client. */
    passwordHash: { type: String, required: false, select: false },
    /** Providers the user has used to sign in. */
    providers: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ?? model<UserDocument>("User", userSchema);
