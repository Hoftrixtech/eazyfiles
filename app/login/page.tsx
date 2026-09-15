import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { getConfiguredOAuthProviders } from "@/lib/auth/oauth-users";
import { getSessionUser } from "@/lib/access/identity";
import { safeNextPath } from "@/lib/auth/paths";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Sign in to your EazyFiles account.",
  path: "/login",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const nextPath = safeNextPath((await searchParams).next);
  const user = await getSessionUser();
  if (user) {
    redirect(nextPath);
  }

  return (
    <AuthPageShell title="Welcome back" description="Sign in with email or Google to use every Image Tool for free.">
      <LoginForm nextPath={nextPath} providers={getConfiguredOAuthProviders()} />
    </AuthPageShell>
  );
}
