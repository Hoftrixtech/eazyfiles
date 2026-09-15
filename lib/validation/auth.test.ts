import { describe, expect, it } from "vitest";
import { loginFieldsSchema, signupFieldsSchema } from "@/lib/validation/auth";

describe("auth validation", () => {
  it("accepts a valid login payload", () => {
    const parsed = loginFieldsSchema.safeParse({
      email: "User@Example.com",
      password: "secret-value",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe("user@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const parsed = loginFieldsSchema.safeParse({
      email: "not-an-email",
      password: "secret-value",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires a letter and number in signup passwords", () => {
    const parsed = signupFieldsSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "abcdefgh",
      confirmPassword: "abcdefgh",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects mismatched signup passwords", () => {
    const parsed = signupFieldsSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "abc12345",
      confirmPassword: "abc12346",
    });
    expect(parsed.success).toBe(false);
  });
});
