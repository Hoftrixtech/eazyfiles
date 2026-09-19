import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isGoogleOAuthConfigured, upsertOAuthUser } from "@/lib/auth/oauth-users";
import { verifyPassword } from "@/lib/auth/password";
import { connectToDatabase } from "@/lib/mongodb";
import { loginFieldsSchema } from "@/lib/validation/auth";
import { User } from "@/models/User";

function buildProviders(): Provider[] {
  const providers: Provider[] = [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginFieldsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash name email providers");
        const passwordOk = await verifyPassword(parsed.data.password, user?.passwordHash);
        if (!user || !passwordOk) {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ];

  if (isGoogleOAuthConfigured()) {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  return providers;
}

function oauthRejectReason(error: unknown): string {
  if (!(error instanceof Error)) {
    return "unknown";
  }
  const message = error.message;
  if (message === "OAUTH_EMAIL_REQUIRED" || message === "OAUTH_EMAIL_UNVERIFIED") {
    return message;
  }
  if (/IP that isn't whitelisted|ENOTFOUND|ECONNREFUSED|MongoServerSelectionError|Could not connect to any servers/i.test(message)) {
    return "mongodb_unreachable";
  }
  return error.name || "upsert_failed";
}

const SENSITIVE_KEY_VALUE_FIELD = /password|secret|token|uri|hash|credential/i;

function redactMongoErrorMessage(message: string): string {
  return message
    .replace(/mongodb(\+srv)?:\/\/[^\s'"]+/gi, "mongodb://[redacted]")
    .replace(/(password|passwd|pwd)(=|:)\S+/gi, "$1=[redacted]");
}

/** Safe MongoDB fields for production OAuth upsert diagnostics (no secrets). */
function safeMongoErrorDiagnostics(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== "object") {
    return {};
  }

  const record = error as Record<string, unknown>;
  const diagnostics: Record<string, unknown> = {};

  if (typeof record.name === "string") {
    diagnostics.errorName = record.name;
  }
  if (typeof record.code === "number" || typeof record.code === "string") {
    diagnostics.errorCode = record.code;
  }
  if (typeof record.message === "string") {
    diagnostics.errorMessage = redactMongoErrorMessage(record.message);
  }

  if (record.keyPattern && typeof record.keyPattern === "object") {
    diagnostics.keyPattern = record.keyPattern;
  }

  if (record.keyValue && typeof record.keyValue === "object") {
    const keyValue = record.keyValue as Record<string, unknown>;
    const safeKeyValue: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(keyValue)) {
      if (SENSITIVE_KEY_VALUE_FIELD.test(field)) {
        continue;
      }
      safeKeyValue[field] = value;
    }
    if (Object.keys(safeKeyValue).length > 0) {
      diagnostics.keyValue = safeKeyValue;
    }
  }

  return diagnostics;
}

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/login",
  },
  providers: buildProviders(),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === "credentials") {
        return true;
      }

      if (account.provider !== "google") {
        console.error("[auth][oauth] signIn rejected", {
          stage: "provider-check",
          provider: account.provider,
          reason: "unsupported_provider",
        });
        return false;
      }

      const profileRecord = profile && typeof profile === "object" ? (profile as Record<string, unknown>) : null;
      const profileEmail = typeof profileRecord?.email === "string" ? profileRecord.email : null;
      const email = user.email ?? profileEmail ?? null;
      const emailVerified = profileRecord?.email_verified !== false && profileRecord?.email_verified !== "false";

      try {
        const local = await upsertOAuthUser({
          provider: "google",
          providerAccountId: account.providerAccountId,
          email,
          name: user.name,
          emailVerified,
        });
        user.id = local.id;
        user.name = local.name;
        user.email = local.email;
        console.info("[auth][oauth] signIn ok", {
          stage: "upsert",
          provider: "google",
          hasEmail: Boolean(local.email),
        });
        return true;
      } catch (error) {
        const mongoDiagnostics = safeMongoErrorDiagnostics(error);
        console.error("[auth][oauth] signIn rejected", {
          stage: "upsert",
          provider: "google",
          reason: oauthRejectReason(error),
          hasEmail: Boolean(email),
          emailVerified,
          ...(Object.keys(mongoDiagnostics).length > 0 ? { mongo: mongoDiagnostics } : {}),
        });
        return false;
      }
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
