import { startGoogleSignIn } from "@/app/oauth-actions";

export function SocialAuthButtons({
  nextPath,
  providers,
}: {
  nextPath: string;
  providers: { google: boolean };
}) {
  return (
    <div className="space-y-3">
      <div className="relative py-1 text-center">
        <span className="bg-card px-3 text-xs font-medium tracking-wide text-muted-foreground">OR</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" aria-hidden="true" />
      </div>
      {providers.google ? (
        <form action={startGoogleSignIn}>
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Continue with Google
          </button>
        </form>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Google sign-in is not configured in this environment yet.
        </p>
      )}
    </div>
  );
}
