import { ToolCard } from "@/components/tools/ToolCard";
import { getRelatedTools } from "@/lib/tools";

export function RelatedTools({
  slug,
  heading = "Related tools",
}: {
  slug: string;
  heading?: string;
}) {
  const tools = getRelatedTools(slug);

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Other image tools in this set. Compressor is available now; resizer, cropper and converter need a free login.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
