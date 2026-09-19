import { ToolCard } from "@/components/tools/ToolCard";
import { getSessionUser } from "@/lib/access/identity";
import { getRelatedTools } from "@/lib/tools";

export async function RelatedTools({
  slug,
  heading = "Related tools",
}: {
  slug: string;
  heading?: string;
}) {
  const user = await getSessionUser();
  const authenticated = Boolean(user);
  const tools = getRelatedTools(slug);

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {authenticated
            ? "Other image tools in this set — all available with your free account."
            : "Other image tools in this set. Compressor is available now; resizer, cropper and converter need a free login."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} authenticated={authenticated} />
        ))}
      </div>
    </section>
  );
}
