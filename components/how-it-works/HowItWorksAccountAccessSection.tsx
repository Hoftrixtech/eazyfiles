import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, KeyRound, UserRound, Zap } from "lucide-react";
import { GoogleSignInSubmitButton } from "@/components/auth/GoogleSignInSubmitButton";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ANONYMOUS_COMPRESSOR_LIMIT, APP_NAME } from "@/lib/constants";
import { getConfiguredOAuthProviders } from "@/lib/auth/oauth-users";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

function CheckItem({ children, tone }: { children: ReactNode; tone: "emerald" | "primary" }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
          tone === "emerald" ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/12 text-primary"
        )}
        aria-hidden="true"
      >
        <Check className="size-3" strokeWidth={2.5} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function AccessIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none" aria-hidden="true">
      <div className="btn-radius border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-primary/[0.04] p-6 sm:p-8">
        <div className="relative mx-auto max-w-xs">
          <div className="btn-radius border border-border bg-card p-4 shadow-[var(--shadow-elevated)]">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 py-2">
              <div className="size-14 rounded-lg bg-muted" />
              <div className="h-2 w-full max-w-[10rem] overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Compressing…</p>
            </div>
          </div>

          <div
            className="absolute -left-2 top-8 w-[7.5rem] rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-2.5 shadow-sm sm:-left-6"
          >
            <p className="text-2xl font-bold leading-none text-emerald-700">{ANONYMOUS_COMPRESSOR_LIMIT}</p>
            <p className="mt-1 text-[0.65rem] font-medium leading-tight text-emerald-800/80">Free compressions</p>
          </div>

          <div
            className="absolute -right-1 top-16 w-[8.5rem] rounded-xl border border-primary/15 bg-card px-3 py-3 shadow-[var(--shadow-elevated)] sm:-right-4"
          >
            <div className="h-7 rounded-md border border-border bg-muted/60 text-center text-[0.6rem] leading-7 text-muted-foreground">
              Sign in with Google
            </div>
            <ul className="mt-2 space-y-1 text-[0.6rem] text-muted-foreground">
              <li>Access all tools</li>
              <li>Continue without limits</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-sm font-medium italic text-primary/80">Sign in to continue</p>
      </div>
    </div>
  );
}

export function HowItWorksAccountAccessSection() {
  const providers = getConfiguredOAuthProviders();
  const limit = ANONYMOUS_COMPRESSOR_LIMIT;

  return (
    <section className="section-padding bg-muted/25" aria-labelledby="how-it-works-account-heading">
      <Container className="max-w-[90rem] space-y-12 lg:space-y-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <header className="max-w-xl">
            <EyebrowPill className="w-fit">Account access</EyebrowPill>
            <SplitHeading
              id="how-it-works-account-heading"
              className="mt-6"
              align="left"
              lead="Start Free."
              accent="Continue After Sign In."
            />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              You can start using {APP_NAME} without creating an account. For the Image Compressor, you can complete up
              to {limit} successful compressions before signing in is required.
            </p>
          </header>
          <AccessIllustration />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article
            className="btn-radius flex flex-col border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-background p-6 sm:p-8 lg:min-h-[22rem]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <UserRound className="size-5" strokeWidth={1.75} />
              </span>
              <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">Without an account</p>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Try First, No Sign In Needed
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              Start using the Image Compressor without creating an account. You can complete up to {limit} successful
              image compressions before signing in.
            </p>
            <div className="mt-8 flex flex-1 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <ul className="space-y-3">
                <CheckItem tone="emerald">Up to {limit} successful compressions</CheckItem>
                <CheckItem tone="emerald">No account required to start</CheckItem>
                <CheckItem tone="emerald">Simple image compression workflow</CheckItem>
                <CheckItem tone="emerald">Sign in when you reach the limit</CheckItem>
              </ul>
              <div className="btn-radius shrink-0 border border-emerald-200/60 bg-card px-4 py-3 shadow-sm">
                <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-emerald-500" />
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{limit} / {limit}</p>
                <p className="text-xs text-muted-foreground">Free compressions available</p>
              </div>
            </div>
          </article>

          <article
            className="btn-radius flex flex-col border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-background p-6 sm:p-8 lg:min-h-[22rem]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                <KeyRound className="size-5" strokeWidth={1.75} />
              </span>
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">With an account</p>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Sign In for Continued Access
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              After reaching the anonymous compression limit, sign in with Google to continue using {APP_NAME} and access
              the available image tools.
            </p>
            <div className="mt-8 flex flex-1 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <ul className="space-y-3">
                <CheckItem tone="primary">Continue after {limit} compressions</CheckItem>
                <CheckItem tone="primary">Access all available image tools</CheckItem>
                <CheckItem tone="primary">Use {APP_NAME} with your account</CheckItem>
                <CheckItem tone="primary">Google sign-in available</CheckItem>
              </ul>
              <div className="w-full max-w-[14rem] shrink-0 lg:w-48">
                <GoogleSignInSubmitButton
                  nextPath="/"
                  disabled={!providers.google}
                  className={cn(!providers.google && "opacity-80")}
                />
                {!providers.google ? (
                  <Link
                    href="/login"
                    className="mt-2 block text-center text-xs font-medium text-primary hover:underline"
                  >
                    Go to login →
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        </div>

        <div
          className="btn-radius grid gap-8 border border-primary/15 bg-primary/[0.06] p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10"
        >
          <span
            className="flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary lg:size-16"
            aria-hidden="true"
          >
            <Zap className="size-7 lg:size-8" strokeWidth={1.75} />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Ready to continue?</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Sign In and Keep Creating
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              Sign in with your Google account to continue using {APP_NAME} after the anonymous Image Compressor limit.
            </p>
          </div>

          <div className="w-full max-w-xs shrink-0 lg:w-56">
            {providers.google ? (
              <>
                <GoogleSignInSubmitButton
                  nextPath="/tools"
                  className={cn(brandCtaClass, "h-12 w-full border-0 text-primary-foreground hover:bg-transparent")}
                >
                  Sign in with Google →
                </GoogleSignInSubmitButton>
              </>
            ) : (
              <Link
                href="/signup"
                className={cn(brandCtaClass, "flex h-12 w-full items-center justify-center gap-2")}
              >
                Create free account
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
