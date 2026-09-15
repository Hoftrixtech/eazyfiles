import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { getConfiguredOAuthProviders } from "@/lib/auth/oauth-users";
import { getSessionUser } from "@/lib/access/identity";
import { safeNextPath } from "@/lib/auth/paths";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign Up",
  description: "Create a free EazyFiles account.",
  path: "/signup",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function SignupPage({
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
    <AuthPageShell
      title="Create a free account"
      description="Create a free account to use Image Resizer, Cropper and Converter, and to keep compressing after 5 anonymous uses."
    >
      <SignupForm nextPath={nextPath} providers={getConfiguredOAuthProviders()} />
    </AuthPageShell>
  );
}
