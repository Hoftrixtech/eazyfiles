import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ToolIcon, getToolsByCategory } from "@/lib/tools";
import type { ToolCategory } from "@/types/tools";

export function CategoryCard({ category }: { category: ToolCategory }) {
  const tools = getToolsByCategory(category.id);
  const liveCount = tools.filter((tool) => tool.status === "live").length;
  const href = `/tools/${category.slug}`;

  return (
    <Link href={href} className="block rounded-lg focus-visible:outline-none">
      <Card className="h-full p-5 transition-colors hover:bg-muted/60">
        <span className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
          <ToolIcon name={category.icon} className="size-4" />
        </span>
        <h3 className="mt-4 font-medium">{category.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.shortDescription}</p>
        <p className="mt-3 text-xs font-medium text-muted-foreground">
          {liveCount > 0
            ? `${liveCount} live tool${liveCount === 1 ? "" : "s"}`
            : "Coming soon"}
        </p>
      </Card>
    </Link>
  );
}
