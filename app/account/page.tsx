import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ToolIcon } from "@/lib/tools";
import { getAccessStatus } from "@/lib/access";
import { getAccountProfile } from "@/lib/access/account";
import { getSessionUser } from "@/lib/access/identity";
import { createPageMetadata } from "@/lib/seo";
import { getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Your EazyFiles dashboard — tools and usage at a glance.",
  path: "/account",
  noIndex: true,
});

const TOOL_LINKS = [
  { slug: "image-compressor", href: "/tools/image-compressor", name: "Image Compressor" },
  { slug: "image-resizer", href: "/tools/image-resizer", name: "Image Resizer" },
  { slug: "image-cropper", href: "/tools/image-cropper", name: "Image Cropper" },
  { slug: "image-converter", href: "/tools/image-converter", name: "Image Converter" },
] as const;

function formatMemberSince(date: Date | null): string {
  if (!date) {
    return "—";
  }
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export default async function AccountDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const profile = await getAccountProfile(user.id);
  const status = await getAccessStatus({ sessionId: user.id, userId: user.id });
  const tools = getToolsByCategory("image-tools");

  return (
    <div className="w-full min-w-0 space-y-8">
      <header>
        <p className="text-sm font-medium text-muted-foreground">My account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Welcome back, {user.name}. Open any image tool or review today&apos;s compressor usage.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Member since</p>
          <p className="mt-2 text-lg font-semibold">{formatMemberSince(profile?.memberSince ?? null)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Compressor today</p>
          <p className="mt-2 text-lg font-semibold">
            {status.compressor.used} / {status.compressor.limit}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Compressions used today</p>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Your image tools</h2>
          <Link href="/tools?category=image-tools" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
          {TOOL_LINKS.map((link) => {
            const catalog = tools.find((t) => t.slug === link.slug);
            const icon = catalog?.icon ?? "images";
            const usage =
              link.slug === "image-compressor"
                ? `${status.compressor.used} / ${status.compressor.limit} compressions today`
                : "Available with your account";
            return (
              <li key={link.slug}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                      <ToolIcon name={icon} className="size-4" />
                    </span>
                    <span>
                      <span className="font-medium">{link.name}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{usage}</span>
                    </span>
                  </span>
                  <span className="text-sm text-primary">Open</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
