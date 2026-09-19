"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/auth-actions";
import { AuthField } from "@/components/auth/AuthField";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/Button";
import { withNextParam } from "@/lib/auth/paths";

export function LoginForm({
  nextPath,
  providers,
}: {
  nextPath: string;
  providers: { google: boolean };
}) {
  const [state, formAction, pending] = useActionState(loginAction, { error: null });

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={nextPath} />
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
          autoComplete="current-password"
          required
          maxLength={128}
        />
        {state.error ? (
          <p className="rounded-md border border-destructive/20 bg-destructive-soft px-3 py-2 text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending} aria-disabled={pending}>
          {pending ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <SocialAuthButtons nextPath={nextPath} providers={providers} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={withNextParam("/signup", nextPath)} className="font-medium text-foreground underline-offset-4 hover:underline">
          Create a free account
        </Link>
      </p>
    </div>
  );
}
