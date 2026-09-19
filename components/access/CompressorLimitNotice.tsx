import Link from "next/link";
import { withNextParam } from "@/lib/auth/paths";

export function CompressorLimitNotice() {
  return (
    <div className="rounded-md border border-border bg-muted/50 px-4 py-4" role="status">
      <p className="text-base font-semibold text-foreground">{"You've used your 5 free compressions."}</p>
      <p className="mt-1 text-sm text-muted-foreground">Log in or create a free account to continue.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href={withNextParam("/login", "/")}
          className="btn-radius brand-gradient-bg inline-flex h-11 flex-1 items-center justify-center px-4 text-sm font-medium text-primary-foreground shadow-sm transition-[filter] hover:brightness-[1.06]"
        >
          Log In
        </Link>
        <Link
          href={withNextParam("/signup", "/")}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
