export async function register() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const { isMongoDbUriConfigured } = await import("@/lib/env/mongodb-uri");
  const { isSmtpEnvConfigured } = await import("@/lib/mail/smtp-config");

  if (!isMongoDbUriConfigured()) {
    console.error("[startup] Contact/support: MongoDB URI is not configured (set MONGODB_URI on Hostinger).");
  }
  if (!isSmtpEnvConfigured()) {
    console.error("[startup] Contact form: SMTP is not configured (set SMTP_* or SMTP_URL on Hostinger).");
  }
}
