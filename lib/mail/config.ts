import "server-only";

import { isSmtpEnvConfigured } from "@/lib/mail/smtp-config";

export const CONTACT_SUPPORT_EMAIL = "support@eazyfiles.com";

export function isSmtpConfigured(): boolean {
  return isSmtpEnvConfigured();
}

export function smtpFromAddress(): string {
  const from = process.env.SMTP_FROM?.trim();
  if (from) {
    return from;
  }
  return `EazyFiles Contact <noreply@eazyfiles.com>`;
}
