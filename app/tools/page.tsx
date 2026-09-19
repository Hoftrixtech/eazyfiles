import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolsCategoryTabs } from "@/components/tools/ToolsCategoryTabs";
import { Container } from "@/components/ui/Container";
import { getSessionUser } from "@/lib/access/identity";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo";
import type { ToolCategoryId } from "@/types/tools";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "All Tools",
  description:
    "Browse live and upcoming file tools by category, including image, PDF, text, calculator, developer, QR and AI utilities.",
  path: "/tools",
});

function resolveInitialCategoryId(categoryParam: string | undefined): ToolCategoryId | undefined {
  if (!categoryParam) {
    return undefined;
  }
  const match = TOOL_CATEGORIES.find((c) => c.slug === categoryParam || c.id === categoryParam);
  return match?.id;
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const user = await getSessionUser();
  const authenticated = Boolean(user);
  const initialCategoryId = resolveInitialCategoryId(categoryParam);

  const tabCategories = TOOL_CATEGORIES.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    shortDescription: category.shortDescription,
    icon: category.icon,
    tools: getToolsByCategory(category.id),
  }));

  return (
    <main className="py-12 sm:py-16">
      <Container className="space-y-10">
        <header className="max-w-2xl">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Tool directory</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All tools</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Pick a category below to browse live tools and what&apos;s coming next. Start with Image Tools for the
            compressor, resizer, cropper and converter.
          </p>
        </header>

        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Loading categories…
            </p>
          }
        >
          <ToolsCategoryTabs
            categories={tabCategories}
            authenticated={authenticated}
            initialCategoryId={initialCategoryId}
          />
        </Suspense>
      </Container>
    </main>
  );
}
