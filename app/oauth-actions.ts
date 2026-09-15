"use server";

import { oauthSignInAction } from "@/app/auth-actions";

export async function startGoogleSignIn(formData: FormData): Promise<void> {
  const next = typeof formData.get("next") === "string" ? String(formData.get("next")) : "/";
  await oauthSignInAction("google", next);
}
