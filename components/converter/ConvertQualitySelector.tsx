"use client";

import { CONVERT_QUALITY_OPTIONS } from "@/lib/constants";
import { brandCtaSelectedClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";
import type { ConvertQuality } from "@/types/convert";

interface ConvertQualitySelectorProps {
  value: ConvertQuality;
  disabled?: boolean;
  outputIsPng?: boolean;
  onChange: (value: ConvertQuality) => void;
  description?: string;
}

export function ConvertQualitySelector({
  value,
  disabled,
  outputIsPng,
  onChange,
  description,
}: ConvertQualitySelectorProps) {
  const helperText =
    description ??
    (outputIsPng
      ? "PNG is lossless. These options only change how tightly the file is packed, not the pixels."
      : "Choose a quality setting for JPG or WebP conversion. Higher quality preserves more image detail, while smaller file settings can reduce file size.");

  return (
    <fieldset disabled={disabled}>
      <legend className="text-base font-semibold tracking-tight text-foreground">Quality</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">{helperText}</p>
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
                "btn-radius flex h-auto min-h-11 flex-col items-center justify-center border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60",
                selected
                  ? cn(brandCtaSelectedClass, "border-transparent")
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              <span className="text-center leading-snug">
                {option.label} — {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
