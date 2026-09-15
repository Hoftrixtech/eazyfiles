"use client";

import { CROP_ASPECT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CropAspectId } from "@/types/crop";

interface AspectRatioSelectorProps {
  value: CropAspectId;
  disabled?: boolean;
  onChange: (value: CropAspectId) => void;
}

export function AspectRatioSelector({ value, disabled, onChange }: AspectRatioSelectorProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="text-sm font-medium">Crop ratio</legend>
      <p className="mt-1 mb-3 text-sm text-muted-foreground">
        Free lets you drag any rectangle. The other options lock the crop box to a common aspect ratio.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {CROP_ASPECT_OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
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
