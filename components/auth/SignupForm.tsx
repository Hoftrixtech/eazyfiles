"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/auth-actions";
import { AuthField } from "@/components/auth/AuthField";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/Button";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { withNextParam } from "@/lib/auth/paths";

export function SignupForm({
  nextPath,
  providers,
}: {
  nextPath: string;
  providers: { google: boolean };
}) {
  const [state, formAction, pending] = useActionState(signupAction, { error: null });

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={nextPath} />
        <AuthField id="name" name="name" type="text" label="Name" autoComplete="name" required maxLength={80} />
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
        />
        <AuthField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={128}
          hint={`Use at least ${MIN_PASSWORD_LENGTH} characters, including a letter and a number.`}
        />
        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
          required
          maxLength={128}
        />
        {state.error ? (
          <p className="rounded-md border border-destructive/20 bg-destructive-soft px-3 py-2 text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending} aria-disabled={pending}>
          {pending ? "Creating account…" : "Create Free Account"}
        </Button>
      </form>

      <SocialAuthButtons nextPath={nextPath} providers={providers} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={withNextParam("/login", nextPath)} className="font-medium text-foreground underline-offset-4 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
