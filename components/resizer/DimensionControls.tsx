"use client";

import { RESIZE_DIMENSION_PRESETS, RESIZE_PERCENT_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DimensionControlsProps {
  width: string;
  height: string;
  maintainAspect: boolean;
  selectedPercent: number | null;
  selectedPreset: string | null;
  disabled?: boolean;
  originalLabel?: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onMaintainAspectChange: (value: boolean) => void;
  onPercentChange: (percent: number) => void;
  onPresetChange: (width: number, height: number, label: string) => void;
}

export function DimensionControls({
  width,
  height,
  maintainAspect,
  selectedPercent,
  selectedPreset,
  disabled,
  originalLabel,
  onWidthChange,
  onHeightChange,
  onMaintainAspectChange,
  onPercentChange,
  onPresetChange,
}: DimensionControlsProps) {
  return (
    <fieldset disabled={disabled} className="space-y-4">
      <legend className="text-sm font-medium">Resize options</legend>
      {originalLabel ? <p className="text-sm text-muted-foreground">Original image {originalLabel}.</p> : null}

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-foreground"
          checked={maintainAspect}
          onChange={(event) => onMaintainAspectChange(event.target.checked)}
        />
        <span>
          <span className="font-medium">Maintain aspect ratio</span>
          <span className="mt-1 block text-muted-foreground">
            When this is on, changing width updates height, and changing height updates width.
          </span>
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="resize-width">
          Width (px)
          <input
            id="resize-width"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={width}
            onChange={(event) => onWidthChange(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="resize-height">
          Height (px)
          <input
            id="resize-height"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={height}
            onChange={(event) => onHeightChange(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm disabled:opacity-60"
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Scale by percent</p>
        <div className="grid grid-cols-4 gap-2">
          {RESIZE_PERCENT_PRESETS.map((percent) => (
            <button
              key={percent}
              type="button"
              aria-pressed={selectedPercent === percent}
              onClick={() => onPercentChange(percent)}
              className={cn(
                "h-10 rounded-md border text-sm font-medium transition-colors disabled:opacity-60",
                selectedPercent === percent
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Common sizes</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RESIZE_DIMENSION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={selectedPreset === preset.label}
              onClick={() => onPresetChange(preset.width, preset.height, preset.label)}
              className={cn(
                "h-11 rounded-md border px-2 text-sm font-medium transition-colors disabled:opacity-60",
                selectedPreset === preset.label
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Presets are optional. You can still type any custom width and height.
        </p>
      </div>
    </fieldset>
  );
}
