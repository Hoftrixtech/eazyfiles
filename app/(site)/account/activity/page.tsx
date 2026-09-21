import type { Metadata } from "next";
import Link from "next/link";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { RecentFilesEmpty } from "@/components/dashboard/RecentFilesEmpty";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAccessStatus } from "@/lib/access";
import { getDashboardStats } from "@/lib/access/dashboard-data";
import { getSessionUser } from "@/lib/access/identity";
import { LAUNCH_ACCESS } from "@/lib/plans/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Activity",
  description: "View your EazyFiles usage and recent compression activity.",
  path: "/account/activity",
  noIndex: true,
});

export default async function AccountActivityPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const stats = await getDashboardStats(user.id, LAUNCH_ACCESS.authenticatedCompressorDailyLimit);
  const status = await getAccessStatus({ sessionId: user.id, userId: user.id });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <section id="usage" className="scroll-mt-28">
        <h2 className="text-lg font-semibold tracking-tight">Usage overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Metrics are based on your signed-in account. Resizer, cropper, and converter usage are not stored yet.
        </p>
        {!stats.persistenceAvailable ? (
          <Card className="mt-4 p-6 text-sm text-muted-foreground">Usage data is temporarily unavailable.</Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Compressions today</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {status.compressor.used} / {status.compressor.limit}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Total compressions</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{stats.totalCompressions ?? "—"}</p>
            </Card>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
        <div className="mt-4">
          <ActivityList
            items={stats.recentCompressions}
            sessionScopedNote={stats.recentActivitySessionScoped}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Recent files</h2>
        <div className="mt-4">
          <RecentFilesEmpty />
        </div>
      </section>

      <Link href="/tools?category=image-tools">
        <Button variant="secondary" size="sm">Explore tools</Button>
      </Link>
    </div>
  );
}
