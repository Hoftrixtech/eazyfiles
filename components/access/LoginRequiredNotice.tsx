"use client";

import Link from "next/link";
import { GoogleSignInSubmitButton } from "@/components/auth/GoogleSignInSubmitButton";
import { withNextParam } from "@/lib/auth/paths";
import { cn } from "@/lib/utils";

interface LoginRequiredNoticeProps {
  nextPath: string;
  title?: string;
  description?: string;
  useGoogleSignIn?: boolean;
  createAccountLabel?: string;
}

export function LoginRequiredNotice({
  nextPath,
  title = "Log in to use this free tool.",
  description = "Create a free account to continue.",
  useGoogleSignIn = false,
  createAccountLabel = "Sign Up",
}: LoginRequiredNoticeProps) {
  return (
    <div className="rounded-md border border-border bg-muted/50 px-4 py-4 sm:px-5 sm:py-5" role="status">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div
        className={cn(
          "mt-4 grid w-full min-w-0 gap-2.5",
          useGoogleSignIn ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {useGoogleSignIn ? (
          <GoogleSignInSubmitButton nextPath={nextPath} className="h-11 w-full" />
        ) : (
          <Link
            href={withNextParam("/login", nextPath)}
            className="btn-radius brand-gradient-bg inline-flex h-11 w-full items-center justify-center px-4 text-sm font-medium text-primary-foreground shadow-sm cursor-pointer"
          >
            Log In
          </Link>
        )}
        <Link
          href={withNextParam("/signup", nextPath)}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted",
            useGoogleSignIn ? "btn-radius" : "rounded-md"
          )}
        >
          {createAccountLabel}
        </Link>
      </div>
    </div>
  );
}
