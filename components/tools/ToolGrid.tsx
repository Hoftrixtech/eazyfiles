import { ToolCard } from "@/components/tools/ToolCard";
import { getSessionUser } from "@/lib/access/identity";
import type { Tool } from "@/types/tools";

export async function ToolGrid({ tools }: { tools: readonly Tool[] }) {
  const user = await getSessionUser();
  const authenticated = Boolean(user);
  if (tools.length === 0) {
    return <p className="text-sm text-muted-foreground">Tools in this category are coming soon.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} authenticated={authenticated} />
      ))}
    </div>
  );
}
