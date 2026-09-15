"use client";

import { CONVERT_QUALITY_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ConvertQuality } from "@/types/convert";

interface ConvertQualitySelectorProps {
  value: ConvertQuality;
  disabled?: boolean;
  outputIsPng?: boolean;
  onChange: (value: ConvertQuality) => void;
}

export function ConvertQualitySelector({
  value,
  disabled,
  outputIsPng,
  onChange,
}: ConvertQualitySelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-medium">Quality</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">
        {outputIsPng
          ? "PNG is lossless. These options only change how tightly the file is packed, not the pixels."
          : "High is the default. Balanced and Smaller File reduce JPEG or WebP quality to shrink the file."}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {CONVERT_QUALITY_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex h-auto min-h-11 flex-col items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60",
                selected
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              <span>{option.label}</span>
              <span className={cn("mt-0.5 text-xs font-normal", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
