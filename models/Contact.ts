import "server-only";

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CONTACT_TOPIC_VALUES } from "@/lib/contact/topics";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    topic: { type: String, required: true, enum: CONTACT_TOPIC_VALUES },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, required: true, default: "new", enum: ["new", "read", "archived"] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1, createdAt: -1 });

export type ContactDocument = InferSchemaType<typeof contactSchema>;

export const Contact: Model<ContactDocument> =
  (models.Contact as Model<ContactDocument> | undefined) ??
  model<ContactDocument>("Contact", contactSchema);
