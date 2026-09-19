import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ToolIcon, getPublicToolHref } from "@/lib/tools";
import { getPublicToolAccessCopy } from "@/lib/plans";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/tools";

function StatusBadge({ tool, authenticated }: { tool: Tool; authenticated: boolean }) {
  const access = tool.status === "live" ? getPublicToolAccessCopy(tool.slug, { authenticated }) : null;
  const available = access?.detail === "Available";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        available ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"
      )}
    >
      {access ? access.detail : "Coming soon"}
    </span>
  );
}

export function ToolCard({ tool, authenticated = false }: { tool: Tool; authenticated?: boolean }) {
  const href = getPublicToolHref(tool);
  const access = tool.status === "live" ? getPublicToolAccessCopy(tool.slug, { authenticated }) : null;
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
          <ToolIcon name={tool.icon} className="size-4" />
        </span>
        <StatusBadge tool={tool} authenticated={authenticated} />
      </div>
      <h3 className="mt-4 font-medium">{tool.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.shortDescription}</p>
      {access ? (
        <p className="mt-4 text-xs font-medium tracking-wide text-foreground">
          {access.tier}
          <span className="mt-1 block font-normal text-muted-foreground">{access.detail}</span>
        </p>
      ) : null}
    </>
  );

  if (tool.status === "live" && href) {
    return (
      <Link href={href} className="block rounded-lg focus-visible:outline-none">
        <Card className="h-full p-5 transition-colors hover:bg-muted/60">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="h-full p-5 opacity-95" aria-disabled="true">
      {content}
    </Card>
  );
}
