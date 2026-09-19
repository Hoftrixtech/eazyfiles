"use client";

import type { SupportedImageFormat } from "@/types/compression";
import { brandCtaSelectedClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

const options: Array<{ value: SupportedImageFormat; label: string }> = [
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

interface ConvertFormatSelectorProps {
  value: SupportedImageFormat;
  disabled?: boolean;
  onChange: (value: SupportedImageFormat) => void;
  description?: string;
}

export function ConvertFormatSelector({
  value,
  disabled,
  onChange,
  description = "Convert your image to JPG, PNG, or WebP. The downloaded file uses the output format you select.",
}: ConvertFormatSelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-semibold tracking-tight text-foreground">Output Format</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">{description}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "btn-radius h-10 border text-sm font-medium transition-colors disabled:opacity-60",
                selected
                  ? cn(brandCtaSelectedClass, "border-transparent")
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
