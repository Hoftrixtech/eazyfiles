import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/lib/validation/contact";

describe("contactFormSchema", () => {
  it("accepts valid input and normalizes email", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Ada Lovelace",
      email: "Ada@Example.com",
      subject: "feedback",
      message: "This is a long enough message.",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("ada@example.com");
      expect(parsed.data.subject).toBe("feedback");
    }
  });

  it("rejects short messages and unknown topics", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      subject: "not-a-topic",
      message: "short",
    });
    expect(parsed.success).toBe(false);
  });

  it("strips control characters from names", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Ada\u0007Test",
      email: "ada@example.com",
      subject: "other",
      message: "Valid message with enough length.",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("AdaTest");
    }
  });
});
