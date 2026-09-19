import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { DashboardCompressionActivity } from "@/lib/access/dashboard-data";
import { formatActivityWhen, jobStatusLabel } from "@/lib/dashboard/format";
import { formatBytes } from "@/lib/utils";

export function ActivityList({
  items,
  sessionScopedNote,
}: {
  items: DashboardCompressionActivity[];
  sessionScopedNote?: boolean;
}) {
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">No activity yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Start by using one of the tools above. Compression history appears here when jobs are recorded for this
          browser session.
        </p>
        <Link href="/tools?category=image-tools" className="mt-6 inline-block">
          <Button variant="primary" size="sm">Explore tools</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sessionScopedNote ? (
        <p className="text-xs text-muted-foreground">
          Showing recent compressions from this browser session. Processed files are not stored for download.
        </p>
      ) : null}
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <p className="truncate font-medium">{item.fileName}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.toolLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:text-right">
              <span className="text-muted-foreground">
                {formatBytes(item.originalSize)} → {formatBytes(item.outputSize)}
              </span>
              <span className="font-medium text-foreground">{jobStatusLabel(item.status)}</span>
              <span className="text-muted-foreground">{formatActivityWhen(item.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
