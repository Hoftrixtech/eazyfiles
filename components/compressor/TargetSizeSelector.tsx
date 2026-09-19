"use client";

import { TARGET_PRESETS } from "@/lib/constants";
import { brandCtaSelectedClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

interface TargetSizeSelectorProps {
  presetBytes: number | null;
  customValue: string;
  customUnit: "KB" | "MB";
  disabled?: boolean;
  onPresetChange: (bytes: number) => void;
  onCustomValueChange: (value: string) => void;
  onCustomUnitChange: (unit: "KB" | "MB") => void;
  onCustomSelect?: () => void;
}

export function TargetSizeSelector({
  presetBytes,
  customValue,
  customUnit,
  disabled,
  onPresetChange,
  onCustomValueChange,
  onCustomUnitChange,
  onCustomSelect,
}: TargetSizeSelectorProps) {
  return (
    <fieldset disabled={disabled} className="space-y-4">
      <legend className="text-base font-semibold tracking-tight text-foreground">Target File Size</legend>
      <p className="text-sm text-muted-foreground">
        Compress your image to the selected size or smaller. The final result may vary depending on the original image
        and output format.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TARGET_PRESETS.map((preset) => {
          const selected = presetBytes === preset.bytes;
          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={selected}
              onClick={() => onPresetChange(preset.bytes)}
              className={cn(
                "btn-radius h-11 border border-transparent text-sm font-medium transition-colors disabled:opacity-60",
                selected ? brandCtaSelectedClass : "border-transparent bg-muted text-foreground hover:bg-muted/80"
              )}
            >
              {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={presetBytes === null}
          onClick={() => onCustomSelect?.()}
          className={cn(
            "btn-radius h-11 border border-transparent text-sm font-medium transition-colors disabled:opacity-60",
            presetBytes === null ? brandCtaSelectedClass : "bg-muted text-foreground hover:bg-muted/80"
          )}
        >
          Custom
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-medium" htmlFor="custom-target">
          Custom Size
          <input
            id="custom-target"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder="Enter target size"
            value={customValue}
            onChange={(event) => onCustomValueChange(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-sm disabled:opacity-60"
          />
        </label>
        <label className="flex w-full flex-col gap-2 text-sm font-medium sm:w-28" htmlFor="custom-unit">
          Unit
          <select
            id="custom-unit"
            value={customUnit}
            onChange={(event) => onCustomUnitChange(event.target.value === "MB" ? "MB" : "KB")}
            className="h-11 w-full rounded-md border border-border bg-muted/50 px-3 text-sm disabled:opacity-60"
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </label>
      </div>
    </fieldset>
  );
}
