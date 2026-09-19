import { beforeEach, describe, expect, it, vi } from "vitest";

const connectToDatabase = vi.fn(async () => ({}));
const isMongoDbUriConfigured = vi.fn(() => true);
const isSmtpConfigured = vi.fn(() => true);
const isContactSubmissionBlocked = vi.fn(async () => false);
const recordContactSubmission = vi.fn(async () => undefined);
const sendContactNotificationEmail = vi.fn(async () => undefined);

const contactCreate = vi.fn(async () => ({ _id: "contact-1" }));

vi.mock("@/lib/env/mongodb-uri", () => ({
  isMongoDbUriConfigured: () => isMongoDbUriConfigured(),
}));

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: () => connectToDatabase(),
}));

vi.mock("@/lib/mail/config", () => ({
  isSmtpConfigured: () => isSmtpConfigured(),
  CONTACT_SUPPORT_EMAIL: "support@eazyfiles.com",
}));

vi.mock("@/lib/contact/rate-limit", () => ({
  isContactSubmissionBlocked: isContactSubmissionBlocked,
  recordContactSubmission: recordContactSubmission,
}));

vi.mock("@/lib/mail/send-contact-notification", () => ({
  sendContactNotificationEmail: sendContactNotificationEmail,
}));

vi.mock("@/models/Contact", () => ({
  Contact: {
    create: contactCreate,
  },
}));

const { POST } = await import("@/app/api/contact/route");

function makeRequest(body: unknown, ip = "203.0.113.10"): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isMongoDbUriConfigured.mockReturnValue(true);
    isSmtpConfigured.mockReturnValue(true);
    isContactSubmissionBlocked.mockResolvedValue(false);
  });

  it("returns 400 for invalid input", async () => {
    const response = await POST(makeRequest({ name: "", email: "bad", subject: "", message: "hi" }));
    expect(response.status).toBe(400);
    expect(contactCreate).not.toHaveBeenCalled();
  });

  it("saves to MongoDB and sends email on success", async () => {
    const response = await POST(
      makeRequest({
        name: "Test User",
        email: "user@example.com",
        subject: "account",
        message: "Need help with my account please.",
      })
    );

    expect(response.status).toBe(201);
    expect(contactCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test User",
        email: "user@example.com",
        topic: "account",
        status: "new",
      })
    );
    expect(sendContactNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "user@example.com",
        topic: "account",
      })
    );
    expect(recordContactSubmission).toHaveBeenCalled();
  });

  it("does not report success when email fails after save", async () => {
    sendContactNotificationEmail.mockRejectedValueOnce(new Error("SMTP down"));
    const response = await POST(
      makeRequest({
        name: "Test User",
        email: "user@example.com",
        subject: "feedback",
        message: "Feedback with enough characters here.",
      })
    );
    expect(response.status).toBe(503);
    expect(contactCreate).toHaveBeenCalled();
    expect(recordContactSubmission).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    isContactSubmissionBlocked.mockResolvedValueOnce(true);
    const response = await POST(
      makeRequest({
        name: "Test User",
        email: "user@example.com",
        subject: "feedback",
        message: "Feedback with enough characters here.",
      })
    );
    expect(response.status).toBe(429);
    expect(contactCreate).not.toHaveBeenCalled();
  });
});
