import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn(async () => ({ messageId: "test" }));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail }),
  },
}));

vi.mock("@/lib/mail/config", () => ({
  isSmtpConfigured: () => true,
  CONTACT_SUPPORT_EMAIL: "support@eazyfiles.com",
  smtpFromAddress: () => "EazyFiles Contact <noreply@eazyfiles.com>",
}));

describe("sendContactNotificationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "smtp-user";
    process.env.SMTP_PASS = "smtp-pass";
  });

  it("sends to support with the submitter as Reply-To", async () => {
    const { sendContactNotificationEmail } = await import("@/lib/mail/send-contact-notification");
    const submittedAt = new Date("2026-09-19T12:00:00.000Z");

    await sendContactNotificationEmail({
      name: "Jane Doe",
      email: "jane@example.com",
      topic: "account",
      message: "I need help signing in to my account.",
      submittedAt,
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "support@eazyfiles.com",
        replyTo: "jane@example.com",
        subject: expect.stringContaining("Account & Sign-In"),
        text: expect.stringContaining("jane@example.com"),
      })
    );
    const firstCall = sendMail.mock.calls.at(0) as [{ text?: string }] | undefined;
    expect(firstCall?.[0]?.text).toContain("2026-09-19T12:00:00.000Z");
  });
});
