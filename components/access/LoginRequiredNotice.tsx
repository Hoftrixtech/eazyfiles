import Link from "next/link";
import { withNextParam } from "@/lib/auth/paths";

interface LoginRequiredNoticeProps {
  nextPath: string;
}

export function LoginRequiredNotice({ nextPath }: LoginRequiredNoticeProps) {
  return (
    <div className="rounded-md border border-border bg-muted/50 px-4 py-4" role="status">
      <p className="text-base font-semibold text-foreground">Log in to use this free tool.</p>
      <p className="mt-1 text-sm text-muted-foreground">Create a free account to continue.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={withNextParam("/login", nextPath)}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Log In
        </Link>
        <Link
          href={withNextParam("/signup", nextPath)}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
