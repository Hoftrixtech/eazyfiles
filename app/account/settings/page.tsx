import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getAccountProfile } from "@/lib/access/account";
import { getSessionUser } from "@/lib/access/identity";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Account settings",
  description: "View your EazyFiles profile and sign-in methods.",
  path: "/account/settings",
  noIndex: true,
});

function providerLabel(provider: string): string {
  if (provider === "google") {
    return "Google";
  }
  if (provider === "credentials") {
    return "Email & password";
  }
  return provider;
}

export default async function AccountSettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const profile = await getAccountProfile(user.id);
  const providers = profile?.providers ?? [];

  return (
    <div className="w-full min-w-0 space-y-8">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          <Link href="/account" className="hover:text-foreground">
            My account
          </Link>
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Profile & settings</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Your basic account details and how you sign in to EazyFiles.
        </p>
      </header>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <h2 className="text-base font-semibold">Profile</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Display name</dt>
              <dd className="mt-1.5 font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account email</dt>
              <dd className="mt-1.5 font-medium">{user.email}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Name and email changes are not available in the app yet. Contact support if you need an update.
          </p>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-base font-semibold">Sign-in methods</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accounts linked to this profile. You can use any listed method to sign in.
          </p>
          <ul className="mt-6 space-y-3">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <li
                  key={provider}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                >
                  <span className="text-sm font-medium">{providerLabel(provider)}</span>
                  <span className="text-xs font-medium text-success">Connected</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No sign-in methods on file.</li>
            )}
          </ul>
          {providers.includes("credentials") ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Password reset and security options will be added here in a future update.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
