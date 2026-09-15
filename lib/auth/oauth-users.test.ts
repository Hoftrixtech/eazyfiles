import { beforeEach, describe, expect, it, vi } from "vitest";

const connectToDatabase = vi.fn();
const oauthFindOne = vi.fn();
const oauthCreate = vi.fn();
const userFindById = vi.fn();
const userFindOne = vi.fn();
const userCreate = vi.fn();

vi.mock("@/lib/mongodb", () => ({
  connectToDatabase: () => connectToDatabase(),
}));

vi.mock("@/models/OAuthAccount", () => ({
  OAuthAccount: {
    findOne: (...args: unknown[]) => oauthFindOne(...args),
    create: (...args: unknown[]) => oauthCreate(...args),
  },
}));

vi.mock("@/models/User", () => ({
  User: {
    findById: (...args: unknown[]) => userFindById(...args),
    findOne: (...args: unknown[]) => userFindOne(...args),
    create: (...args: unknown[]) => userCreate(...args),
  },
}));

describe("upsertOAuthUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectToDatabase.mockResolvedValue(undefined);
  });

  it("creates an OAuth-only user without a password", async () => {
    oauthFindOne.mockResolvedValue(null);
    userFindOne.mockResolvedValue(null);
    userCreate.mockResolvedValue({
      _id: { toString: () => "user-1" },
      name: "Ada",
      email: "ada@example.com",
      providers: ["google"],
    });
    oauthCreate.mockResolvedValue({});

    const { upsertOAuthUser } = await import("@/lib/auth/oauth-users");
    const result = await upsertOAuthUser({
      provider: "google",
      providerAccountId: "google-sub-1",
      email: "ada@example.com",
      name: "Ada",
      emailVerified: true,
    });

    expect(userCreate).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      providers: ["google"],
    });
    expect(result).toEqual({ id: "user-1", name: "Ada", email: "ada@example.com" });
  });

  it("links Google to an existing email/password account", async () => {
    const existing = {
      _id: { toString: () => "user-2" },
      name: "Existing",
      email: "existing@example.com",
      providers: ["credentials"],
      save: vi.fn().mockResolvedValue(undefined),
    };
    oauthFindOne.mockResolvedValue(null);
    userFindOne.mockResolvedValue(existing);
    oauthCreate.mockResolvedValue({});

    const { upsertOAuthUser } = await import("@/lib/auth/oauth-users");
    const result = await upsertOAuthUser({
      provider: "google",
      providerAccountId: "google-sub-2",
      email: "existing@example.com",
      name: "Existing",
      emailVerified: true,
    });

    expect(userCreate).not.toHaveBeenCalled();
    expect(existing.providers).toContain("google");
    expect(existing.save).toHaveBeenCalled();
    expect(result.id).toBe("user-2");
  });

  it("rejects unverified emails for email-based create/link", async () => {
    oauthFindOne.mockResolvedValue(null);
    const { upsertOAuthUser } = await import("@/lib/auth/oauth-users");
    await expect(
      upsertOAuthUser({
        provider: "google",
        providerAccountId: "google-sub-3",
        email: "unverified@example.com",
        emailVerified: false,
      })
    ).rejects.toThrow("OAUTH_EMAIL_UNVERIFIED");
  });
});
