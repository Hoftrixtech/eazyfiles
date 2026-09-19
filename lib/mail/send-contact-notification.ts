import "server-only";

import nodemailer from "nodemailer";
import type { ContactTopicValue } from "@/lib/contact/topics";
import { contactTopicLabel } from "@/lib/contact/topics";
import { sanitizeContactField } from "@/lib/contact/sanitize";
import { CONTACT_SUPPORT_EMAIL, isSmtpConfigured, smtpFromAddress } from "@/lib/mail/config";

export type ContactEmailPayload = {
  name: string;
  email: string;
  topic: ContactTopicValue;
  message: string;
  submittedAt: Date;
};

function createTransport() {
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("SMTP_PORT_INVALID");
  }

  const secure =
    process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendContactNotificationEmail(payload: ContactEmailPayload): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const replyTo = sanitizeContactField(payload.email, 254);
  const safeName = sanitizeContactField(payload.name, 80);
  const topicLabel = contactTopicLabel(payload.topic);
  const submittedAtIso = payload.submittedAt.toISOString();

  const text = [
    "New EazyFiles contact form submission",
    "",
    `Name: ${safeName}`,
    `Email: ${replyTo}`,
    `Topic: ${topicLabel}`,
    `Submitted at (UTC): ${submittedAtIso}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const transport = createTransport();
  await transport.sendMail({
    from: smtpFromAddress(),
    to: CONTACT_SUPPORT_EMAIL,
    replyTo,
    subject: `[EazyFiles Contact] ${topicLabel}`,
    text,
  });
}
