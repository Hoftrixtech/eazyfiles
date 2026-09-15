import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/auth-actions";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToolIcon } from "@/lib/tools";
import { getAccessStatus } from "@/lib/access";
import { getSessionUser } from "@/lib/access/identity";
import { createPageMetadata } from "@/lib/seo";
import { getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Account",
  description: "View your EazyFiles account.",
  path: "/account",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const TOOL_LINKS = [
  { slug: "image-compressor", href: "/tools/image-compressor", name: "Image Compressor" },
  { slug: "image-resizer", href: "/tools/image-resizer", name: "Image Resizer" },
  { slug: "image-cropper", href: "/tools/image-cropper", name: "Image Cropper" },
  { slug: "image-converter", href: "/tools/image-converter", name: "Image Converter" },
] as const;

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?next=/account");
  }

  const status = await getAccessStatus({ sessionId: user.id, userId: user.id });
  const tools = getToolsByCategory("image-tools");

  return (
    <main className="border-t border-border">
      <Container className="section-padding max-w-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage your account and open any Image Tool.</p>
          </div>
          <form action={logoutAction} className="shrink-0">
            <Button type="submit" variant="secondary">Log out</Button>
          </form>
        </div>

        <Card className="mt-10 p-6 sm:p-8">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Account information</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="mt-1 font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
          </dl>
        </Card>

        <section className="mt-10">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Tools</h2>
          <ul className="mt-4 divide-y divide-border rounded-sm border border-border bg-card">
            {TOOL_LINKS.map((link) => {
              const catalog = tools.find((t) => t.slug === link.slug);
              const icon = catalog?.icon ?? "images";
              const usage =
                link.slug === "image-compressor"
                  ? `${status.compressor.used} / ${status.compressor.limit} compressions today`
                  : "Available";
              return (
                <li key={link.slug}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-sm border border-border bg-muted">
                        <ToolIcon name={icon} className="size-4" />
                      </span>
                      <span>
                        <span className="font-medium">{link.name}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{usage}</span>
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">Open</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>
    </main>
  );
}
