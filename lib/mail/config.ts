import "server-only";

export const CONTACT_SUPPORT_EMAIL = "support@eazyfiles.com";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS
  );
}

export function smtpFromAddress(): string {
  const from = process.env.SMTP_FROM?.trim();
  if (from) {
    return from;
  }
  return `EazyFiles Contact <noreply@eazyfiles.com>`;
}
