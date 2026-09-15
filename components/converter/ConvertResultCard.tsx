"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes, formatDimensions } from "@/lib/utils";
import type { ConvertClientResult } from "@/lib/client/convert-request";

interface ConvertResultCardProps {
  result: ConvertClientResult;
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

function sizeDeltaLabel(percent: number): string {
  if (percent > 0) {
    return `${percent}% smaller`;
  }
  if (percent < 0) {
    return `${Math.abs(percent)}% larger`;
  }
  return "Same size";
}

export function ConvertResultCard({ result, onDownload, onReset }: ConvertResultCardProps) {
  return (
    <div className="animate-fade-up space-y-5 rounded-md border border-border bg-muted/30 p-5">
      <div>
        <h3 className="font-medium">Conversion complete</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Converted from {formatLabel(result.originalFormat)} to {formatLabel(result.outputFormat)}.
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.objectUrl}
        alt="Converted image preview"
        className="mx-auto max-h-64 w-full rounded-md bg-card object-contain"
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Original</dt>
          <dd className="mt-1 font-medium">{formatLabel(result.originalFormat)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">
            {formatDimensions(result.originalWidth, result.originalHeight)}
          </dd>
          <dd className="mt-1 text-sm text-muted-foreground">{formatBytes(result.originalSize)}</dd>
        </div>
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Result</dt>
          <dd className="mt-1 font-medium">{formatLabel(result.outputFormat)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">
            {formatDimensions(result.outputWidth, result.outputHeight)}
          </dd>
          <dd className="mt-1 text-sm text-muted-foreground">{formatBytes(result.outputSize)}</dd>
        </div>
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Size change</dt>
          <dd className="mt-1 font-medium">{sizeDeltaLabel(result.sizeDeltaPercent)}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">{result.filename}</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onDownload} className="sm:flex-1" aria-label="Download converted image">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
        <Button variant="secondary" onClick={onReset} className="sm:flex-1">
          <RotateCcw className="size-4" aria-hidden="true" />
          Convert Another Image
        </Button>
      </div>
    </div>
  );
}
