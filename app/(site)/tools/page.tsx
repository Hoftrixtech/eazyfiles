import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
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
    <main>
      <PageHeroBanner
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Tools" },
        ]}
        eyebrow="Tool directory"
        title="All Tools"
        description="Pick a category below to browse live tools and what's coming next. Start with Image Tools for the compressor, resizer, cropper and converter."
      />
      <Container className="section-padding w-full space-y-10">
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
