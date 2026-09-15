"use client";

import type { SupportedImageFormat } from "@/types/compression";
import { cn } from "@/lib/utils";

const options: Array<{ value: SupportedImageFormat; label: string }> = [
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

interface ConvertFormatSelectorProps {
  value: SupportedImageFormat;
  disabled?: boolean;
  onChange: (value: SupportedImageFormat) => void;
}

export function ConvertFormatSelector({ value, disabled, onChange }: ConvertFormatSelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-medium">Output format</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">
        Convert the image to JPEG, PNG or WebP. MIME type and file extension will match the format you pick.
      </p>
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
                "h-10 rounded-md border text-sm font-medium transition-colors disabled:opacity-60",
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
