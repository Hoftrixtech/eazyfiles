import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { OAuthAccount } from "@/models/OAuthAccount";
import { User, type AuthProviderId } from "@/models/User";

function displayNameFromProfile(input: {
  name?: string | null;
  email?: string | null;
}): string {
  const fromName = input.name?.trim();
  if (fromName) {
    return fromName.slice(0, 80);
  }
  const fromEmail = input.email?.split("@")[0]?.trim();
  if (fromEmail) {
    return fromEmail.slice(0, 80);
  }
  return "EazyFiles User";
}

/**
 * Find or create a local user for an OAuth provider sign-in.
 * Links by provider account id first, then by verified email when available.
 * OAuth-only users do not require a password.
 */
export async function upsertOAuthUser(input: {
  provider: AuthProviderId;
  providerAccountId: string;
  email?: string | null;
  name?: string | null;
  /** When false, refuse email-based create/link (prevents unsafe takeover). */
  emailVerified?: boolean;
}): Promise<{ id: string; name: string; email: string }> {
  await connectToDatabase();

  const existingLink = await OAuthAccount.findOne({
    provider: input.provider,
    providerAccountId: input.providerAccountId,
  });

  if (existingLink) {
    const user = await User.findById(existingLink.userId);
    if (user) {
      if (!user.providers.includes(input.provider)) {
        user.providers.push(input.provider);
        await user.save();
      }
      return { id: String(user._id), name: user.name, email: user.email };
    }
  }

  const email = input.email?.trim().toLowerCase() || null;
  if (!email) {
    throw new Error("OAUTH_EMAIL_REQUIRED");
  }
  if (input.emailVerified === false) {
    throw new Error("OAUTH_EMAIL_UNVERIFIED");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: displayNameFromProfile(input),
      email,
      providers: [input.provider],
    });
  } else if (!user.providers.includes(input.provider)) {
    user.providers.push(input.provider);
    await user.save();
  }

  try {
    await OAuthAccount.create({
      userId: user._id,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      type: "oauth",
    });
  } catch (error) {
    const duplicate = Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
    if (!duplicate) {
      throw error;
    }
  }

  return { id: String(user._id), name: user.name, email: user.email };
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getConfiguredOAuthProviders(): { google: boolean } {
  return {
    google: isGoogleOAuthConfigured(),
  };
}
