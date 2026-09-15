"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import type { CompressClientResult } from "@/lib/client/compress-request";

interface ResultCardProps {
  result: CompressClientResult;
  onDownload: () => void;
  onReset: () => void;
}

function formatLabel(format: string): string {
  if (format === "jpeg") {
    return "JPG";
  }
  if (format === "png") {
    return "PNG";
  }
  if (format === "webp") {
    return "WebP";
  }
  return format.toUpperCase();
}

function statusMessage(result: CompressClientResult): string {
  if (result.skipped) {
    return "No compression was necessary. Your image is already at or below the target size.";
  }

  if (result.targetMet) {
    return "Compressed to the highest quality that stays at or below your target size.";
  }

  return "Your target is smaller than we can reach while keeping a usable image. This is the best result we could produce.";
}

export function ResultCard({ result, onDownload, onReset }: ResultCardProps) {
  const savedPercent = result.savedPercent;

  return (
    <div className="animate-fade-up space-y-6 rounded-sm border border-border bg-muted/40 p-6 sm:p-8">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{result.skipped ? "Already within target" : "Your image is ready"}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{statusMessage(result)}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-sm border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Original Size</dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight">{formatBytes(result.originalSize)}</dd>
        </div>
        <div className="rounded-sm border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Compressed Size</dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight">{formatBytes(result.compressedSize)}</dd>
        </div>
        <div className="rounded-sm border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Saved %</dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight">{savedPercent}%</dd>
        </div>
        <div className="rounded-sm border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Output Format</dt>
          <dd className="mt-2 text-lg font-semibold tracking-tight">{formatLabel(result.outputFormat)}</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-3">
        <Button onClick={onDownload} size="lg" className="w-full" aria-label="Download compressed image">
          <Download className="size-4" aria-hidden="true" />
          Download Image
        </Button>
        <Button variant="secondary" onClick={onReset} size="lg" className="w-full">
          <RotateCcw className="size-4" aria-hidden="true" />
          Compress another image
        </Button>
      </div>
    </div>
  );
}
