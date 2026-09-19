"use client";

import { PDF_PAGE_LAYOUT_OPTIONS, type PdfPageLayout } from "@/types/pdf";
import { cn } from "@/lib/utils";
import { brandCtaSelectedClass } from "@/lib/brand-styles";

export function PdfLayoutSelector({
  value,
  disabled,
  onChange,
}: {
  value: PdfPageLayout;
  disabled?: boolean;
  onChange: (layout: PdfPageLayout) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Page layout</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose how each image is placed in the PDF. Multiple images become separate pages in order.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {PDF_PAGE_LAYOUT_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "btn-radius border border-border bg-card p-4 text-left transition-colors",
                "hover:border-primary/25 disabled:opacity-50",
                selected && brandCtaSelectedClass
              )}
            >
              <span className={cn("block text-sm font-medium", selected ? "text-primary-foreground" : "text-foreground")}>
                {option.label}
              </span>
              <span
                className={cn(
                  "mt-1 block text-xs leading-relaxed",
                  selected ? "text-primary-foreground/90" : "text-muted-foreground"
                )}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
