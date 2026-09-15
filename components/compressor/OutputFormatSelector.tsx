"use client";

import type { OutputFormatOption } from "@/types/compression";
import { cn } from "@/lib/utils";

const options: Array<{ value: OutputFormatOption; label: string }> = [
  { value: "original", label: "Original" },
  { value: "jpeg", label: "JPG" },
  { value: "webp", label: "WebP" },
  { value: "png", label: "PNG" },
];

interface OutputFormatSelectorProps {
  value: OutputFormatOption;
  disabled?: boolean;
  onChange: (value: OutputFormatOption) => void;
  description?: string;
}

export function OutputFormatSelector({
  value,
  disabled,
  onChange,
  description = "Keep the original format, or convert when you need a smaller file.",
}: OutputFormatSelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-medium">Output Format</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">{description}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-10 rounded-sm border text-sm font-medium transition-colors disabled:opacity-60",
                selected
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
