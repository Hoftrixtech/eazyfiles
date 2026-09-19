import "server-only";

import { clientIpFromHeaders } from "@/lib/auth/attempts";
import { isContactSubmissionBlocked, recordContactSubmission } from "@/lib/contact/rate-limit";
import { errorJson } from "@/lib/errors";
import { isSmtpConfigured } from "@/lib/mail/config";
import { sendContactNotificationEmail } from "@/lib/mail/send-contact-notification";
import { isMongoDbUriConfigured } from "@/lib/env/mongodb-uri";
import { connectToDatabase } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";
import { contactFieldErrors, contactFormSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactSuccessBody = {
  success: true;
};

type ContactValidationErrorBody = {
  success: false;
  error: {
    code: "INVALID_REQUEST";
    message: string;
    fields?: Record<string, string>;
  };
};

export async function POST(request: Request): Promise<Response> {
  const ip = clientIpFromHeaders(request.headers);

  if (!isMongoDbUriConfigured()) {
    console.error("[contact] MongoDB URI is not configured (MONGODB_URI / DATABASE_URL)");
    return errorJson(
      "DATABASE_UNAVAILABLE",
      "The service is temporarily unavailable. Please try again shortly.",
      503
    );
  }

  if (!isSmtpConfigured()) {
    console.error("[contact] SMTP is not configured");
    return errorJson(
      "DATABASE_UNAVAILABLE",
      "The service is temporarily unavailable. Please try again shortly.",
      503
    );
  }

  try {
    if (await isContactSubmissionBlocked(ip)) {
      return errorJson("RATE_LIMITED", "Too many messages. Please try again later.", 429);
    }
  } catch (error) {
    console.error("[contact] rate limit check failed", error);
    return errorJson(
      "DATABASE_UNAVAILABLE",
      "The service is temporarily unavailable. Please try again shortly.",
      503
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return errorJson("INVALID_REQUEST", "Invalid request.", 400);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return errorJson("INVALID_REQUEST", "Invalid request.", 400);
  }

  const parsed = contactFormSchema.safeParse(json);
  if (!parsed.success) {
    const fields = contactFieldErrors(parsed.error);
    const body: ContactValidationErrorBody = {
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Please fix the highlighted fields.",
        fields,
      },
    };
    return Response.json(body, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const { name, email, subject: topic, message } = parsed.data;
  const submittedAt = new Date();

  let contactId: string;
  try {
    await connectToDatabase();
    const doc = await Contact.create({
      name,
      email,
      topic,
      message,
      status: "new",
      createdAt: submittedAt,
    });
    contactId = String(doc._id);
  } catch (error) {
    console.error("[contact] database save failed", error);
    return errorJson(
      "DATABASE_UNAVAILABLE",
      "The service is temporarily unavailable. Please try again shortly.",
      503
    );
  }

  try {
    await sendContactNotificationEmail({
      name,
      email,
      topic,
      message,
      submittedAt,
    });
  } catch (error) {
    console.error("[contact] email delivery failed", { contactId, error });
    return errorJson(
      "DATABASE_UNAVAILABLE",
      "We could not send your message right now. Please try again in a few minutes.",
      503
    );
  }

  try {
    await recordContactSubmission(ip);
  } catch (error) {
    console.error("[contact] rate limit record failed", { contactId, error });
  }

  const body: ContactSuccessBody = { success: true };
  return Response.json(body, { status: 201, headers: { "Cache-Control": "no-store" } });
}
