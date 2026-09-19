import { z } from "zod";
import { CONTACT_TOPIC_VALUES, type ContactTopicValue } from "@/lib/contact/topics";

const contactTopicEnum = CONTACT_TOPIC_VALUES as [ContactTopicValue, ...ContactTopicValue[]];
import { emailSchema } from "@/lib/validation/auth";
import { sanitizeContactField, sanitizeContactMessage } from "@/lib/contact/sanitize";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(80, "Name is too long.")
    .transform((value) => sanitizeContactField(value, 80)),
  email: emailSchema.transform((value) => sanitizeContactField(value, 254)),
  subject: z.enum(contactTopicEnum, {
    message: "Choose a topic.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters.")
    .max(5000, "Message is too long.")
    .transform((value) => sanitizeContactMessage(value, 5000)),
});

export type ContactFormFields = z.infer<typeof contactFormSchema>;

export function contactFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) {
      fields[key] = issue.message;
    }
  }
  return fields;
}
