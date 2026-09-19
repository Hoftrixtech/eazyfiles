"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolIcon } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { Tool, ToolCategoryId, ToolIconName } from "@/types/tools";

export type ToolsTabCategory = {
  id: ToolCategoryId;
  slug: string;
  name: string;
  shortDescription: string;
  icon: ToolIconName;
  tools: readonly Tool[];
};

function tabButtonId(categoryId: ToolCategoryId) {
  return `tools-tab-${categoryId}`;
}

function tabPanelId(categoryId: ToolCategoryId) {
  return `tools-panel-${categoryId}`;
}

export function ToolsCategoryTabs({
  categories,
  authenticated,
  initialCategoryId,
}: {
  categories: readonly ToolsTabCategory[];
  authenticated: boolean;
  initialCategoryId?: ToolCategoryId;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedInitial =
    categories.find((c) => c.id === initialCategoryId)?.id ?? categories[0]?.id ?? "image-tools";
  const [activeId, setActiveId] = useState<ToolCategoryId>(resolvedInitial);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (!categoryParam) {
      return;
    }
    const match = categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
    if (match) {
      setActiveId(match.id);
    }
  }, [categoryParam, categories]);

  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  const selectCategory = useCallback(
    (category: ToolsTabCategory) => {
      setActiveId(category.id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", category.slug);
      const query = params.toString();
      router.replace(query ? `/tools?${query}` : "/tools", { scroll: false });
    },
    [router, searchParams]
  );

  if (!active) {
    return null;
  }

  return (
    <div className="w-full min-w-0 space-y-8">
      <div
        role="tablist"
        aria-label="Tool categories"
        className="flex w-full max-w-full gap-1 overflow-x-auto pb-1 [scrollbar-width:thin]"
      >
        {categories.map((category) => {
          const selected = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={tabButtonId(category.id)}
              aria-selected={selected}
              aria-controls={tabPanelId(category.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectCategory(category)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/15 hover:bg-muted hover:text-foreground"
              )}
            >
              <ToolIcon name={category.icon} className="size-4 shrink-0 opacity-90" />
              {category.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={tabPanelId(active.id)}
        aria-labelledby={tabButtonId(active.id)}
        className="w-full min-w-0 space-y-6"
      >
        <div className="w-full">
          <h2 className="text-xl font-semibold tracking-tight">{active.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {active.shortDescription}
          </p>
        </div>

        {active.tools.length > 0 ? (
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} authenticated={authenticated} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center text-sm text-muted-foreground">
            Tools in this category are coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
