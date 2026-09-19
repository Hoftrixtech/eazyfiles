"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { signIn, signOut } from "@/auth";
import {
  clearAuthAttempts,
  clientIpFromHeaders,
  isAuthAttemptBlocked,
  recordFailedAuthAttempt,
} from "@/lib/auth/attempts";
import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import { postAuthRedirectPath } from "@/lib/auth/paths";
import { loginFieldsSchema, signupFieldsSchema } from "@/lib/validation/auth";
import { User } from "@/models/User";

const GENERIC_LOGIN_ERROR = "Invalid email or password.";
const GENERIC_SIGNUP_ERROR = "We could not create an account. Please try again or log in if you already have one.";
const RATE_LIMIT_ERROR = "Too many attempts. Please wait a few minutes and try again.";

function isNextRedirect(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const parsed = loginFieldsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_LOGIN_ERROR };
  }

  if (!isMongoConfigured()) {
    return { error: "The service is temporarily unavailable. Please try again shortly." };
  }

  const ip = clientIpFromHeaders(await headers());
  try {
    if (await isAuthAttemptBlocked("login", parsed.data.email, ip)) {
      return { error: RATE_LIMIT_ERROR };
    }
  } catch {
    return { error: "The service is temporarily unavailable. Please try again shortly." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: postAuthRedirectPath(formData.get("next")),
    });
    await clearAuthAttempts("login", parsed.data.email, ip);
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    await recordFailedAuthAttempt("login", parsed.data.email, ip).catch(() => undefined);
    if (error instanceof AuthError) {
      return { error: GENERIC_LOGIN_ERROR };
    }
    return { error: GENERIC_LOGIN_ERROR };
  }

  return { error: null };
}

export async function signupAction(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const parsed = signupFieldsSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_SIGNUP_ERROR };
  }

  if (!isMongoConfigured()) {
    return { error: "The service is temporarily unavailable. Please try again shortly." };
  }

  const ip = clientIpFromHeaders(await headers());
  try {
    if (await isAuthAttemptBlocked("register", parsed.data.email, ip)) {
      return { error: RATE_LIMIT_ERROR };
    }

    await connectToDatabase();
    const passwordHash = await hashPassword(parsed.data.password);
    try {
      await User.create({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        providers: ["credentials"],
      });
    } catch {
      await recordFailedAuthAttempt("register", parsed.data.email, ip).catch(() => undefined);
      return { error: GENERIC_SIGNUP_ERROR };
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: postAuthRedirectPath(formData.get("next")),
    });
    await clearAuthAttempts("register", parsed.data.email, ip);
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
    return { error: GENERIC_SIGNUP_ERROR };
  }

  return { error: null };
}

export async function oauthSignInAction(provider: "google", nextPath?: string): Promise<void> {
  await signIn(provider, { redirectTo: postAuthRedirectPath(nextPath ?? "/") });
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
