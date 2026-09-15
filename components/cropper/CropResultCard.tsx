"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes, formatDimensions } from "@/lib/utils";
import type { CropClientResult } from "@/lib/client/crop-request";

interface CropResultCardProps {
  result: CropClientResult;
  onDownload: () => void;
  onReset: () => void;
}

function formatLabel(format: string): string {
  if (format === "jpeg") {
    return "JPEG";
  }
  if (format === "png") {
    return "PNG";
  }
  if (format === "webp") {
    return "WebP";
  }
  return format.toUpperCase();
}

export function CropResultCard({ result, onDownload, onReset }: CropResultCardProps) {
  return (
    <div className="animate-fade-up space-y-5 rounded-md border border-border bg-muted/30 p-5">
      <div>
        <h3 className="font-medium">Crop complete</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The image was cropped to {formatDimensions(result.outputWidth, result.outputHeight)} and encoded as{" "}
          {formatLabel(result.outputFormat)}.
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.objectUrl}
        alt="Cropped image preview"
        className="mx-auto max-h-64 w-full rounded-md bg-card object-contain"
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Original</dt>
          <dd className="mt-1 font-medium">{formatDimensions(result.originalWidth, result.originalHeight)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">{formatBytes(result.originalSize)}</dd>
        </div>
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Result</dt>
          <dd className="mt-1 font-medium">{formatDimensions(result.outputWidth, result.outputHeight)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">{formatBytes(result.outputSize)}</dd>
        </div>
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Output format</dt>
          <dd className="mt-1 font-medium">{formatLabel(result.outputFormat)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">
            {result.sizeDeltaPercent > 0
              ? `${result.sizeDeltaPercent}% smaller`
              : result.sizeDeltaPercent < 0
                ? `${Math.abs(result.sizeDeltaPercent)}% larger`
                : "Same size"}
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onDownload} className="sm:flex-1" aria-label="Download cropped image">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
        <Button variant="secondary" onClick={onReset} className="sm:flex-1">
          <RotateCcw className="size-4" aria-hidden="true" />
          Crop Another Image
        </Button>
      </div>
    </div>
  );
}
