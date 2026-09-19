import type { Metadata } from "next";
import { Crop, ImageDown, Repeat, Scaling } from "lucide-react";
import { AccountSummaryCard } from "@/components/dashboard/AccountSummaryCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { QuickToolCard } from "@/components/dashboard/QuickToolCard";
import { RecentFilesEmpty } from "@/components/dashboard/RecentFilesEmpty";
import { Card } from "@/components/ui/Card";
import { getAccessStatus } from "@/lib/access";
import { getAccountProfile } from "@/lib/access/account";
import { getDashboardStats } from "@/lib/access/dashboard-data";
import { getSessionUser } from "@/lib/access/identity";
import { displayUserName } from "@/lib/dashboard/format";
import { LAUNCH_ACCESS } from "@/lib/plans/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Your EazyFiles dashboard — tools and usage at a glance.",
  path: "/account",
  noIndex: true,
});

const QUICK_TOOLS = [
  {
    title: "Image Compressor",
    description: "Reduce image file size while maintaining quality.",
    href: "/",
    icon: ImageDown,
  },
  {
    title: "Image Resizer",
    description: "Resize images to the dimensions you need.",
    href: "/tools/image-resizer",
    icon: Scaling,
  },
  {
    title: "Image Cropper",
    description: "Crop images quickly and precisely.",
    href: "/tools/image-cropper",
    icon: Crop,
  },
  {
    title: "Image Converter",
    description: "Convert images between supported formats.",
    href: "/tools/image-converter",
    icon: Repeat,
  },
] as const;

export default async function AccountDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const profile = await getAccountProfile(user.id);
  const stats = await getDashboardStats(user.id, LAUNCH_ACCESS.authenticatedCompressorDailyLimit);
  const status = await getAccessStatus({ sessionId: user.id, userId: user.id });
  const welcomeName = displayUserName(user.name, user.email);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {welcomeName} 👋</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Manage your files and access your image tools from one place.
        </p>
      </section>

      <section aria-labelledby="quick-tools-heading">
        <h2 id="quick-tools-heading" className="text-lg font-semibold tracking-tight">Quick tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {QUICK_TOOLS.map((tool) => (
            <QuickToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      <section aria-labelledby="usage-heading">
        <h2 id="usage-heading" className="text-lg font-semibold tracking-tight">Usage overview</h2>
        {!stats.persistenceAvailable ? (
          <Card className="mt-4 p-6 text-sm text-muted-foreground">
            Usage data is temporarily unavailable. Your tools are still available.
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Compressions today</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {status.compressor.used}
                <span className="text-base font-normal text-muted-foreground"> / {status.compressor.limit}</span>
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Total compressions</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {stats.totalCompressions ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">While signed in to your account</p>
            </Card>
            <Card className="p-5 sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Active days</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {stats.activeDaysWithUsage ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Days with recorded compressor usage</p>
            </Card>
          </div>
        )}
      </section>

      <section aria-labelledby="recent-activity-heading">
        <h2 id="recent-activity-heading" className="text-lg font-semibold tracking-tight">Recent activity</h2>
        <div className="mt-4">
          <ActivityList
            items={stats.recentCompressions}
            sessionScopedNote={stats.recentActivitySessionScoped}
          />
        </div>
      </section>

      <section aria-labelledby="recent-files-heading">
        <h2 id="recent-files-heading" className="text-lg font-semibold tracking-tight">Recent files</h2>
        <div className="mt-4">
          <RecentFilesEmpty />
        </div>
      </section>

      <section aria-labelledby="account-summary-heading" className="pb-4">
        <h2 id="account-summary-heading" className="sr-only">Account summary</h2>
        <AccountSummaryCard
          name={user.name}
          email={user.email}
          memberSince={profile?.memberSince ?? null}
        />
      </section>
    </div>
  );
}
