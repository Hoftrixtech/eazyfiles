import type { Metadata } from "next";
import { CategoryCard } from "@/components/tools/CategoryCard";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Container } from "@/components/ui/Container";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "All Tools",
  description:
    "Browse live and upcoming file tools by category, including image, PDF, text, calculator, developer, QR and AI utilities.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container className="space-y-12">
        <header className="max-w-2xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Tool directory</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All tools</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Start with the live Image Compressor. Other utilities are listed by category so they can be added without
            duplicating the app structure.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {TOOL_CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.id);
          if (tools.length === 0) {
            return null;
          }

          return (
            <section key={category.id} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{category.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.shortDescription}</p>
              </div>
              <ToolGrid tools={tools} />
            </section>
          );
        })}
      </Container>
    </main>
  );
}
