"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import type { CompressClientResult } from "@/lib/client/compress-request";

export interface BatchResultItem {
  sourceName: string;
  result: CompressClientResult;
}

function formatLabel(format: string): string {
  if (format === "jpeg") return "JPG";
  if (format === "png") return "PNG";
  if (format === "webp") return "WebP";
  return format.toUpperCase();
}

function downloadResult(result: CompressClientResult) {
  const link = document.createElement("a");
  link.href = result.objectUrl;
  link.download = result.filename.replace(/[\r\n"]/g, "");
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

interface BatchResultsPanelProps {
  items: BatchResultItem[];
  failedCount?: number;
  onReset: () => void;
  onCompressAgain?: () => void;
}

export function BatchResultsPanel({ items, failedCount = 0, onReset, onCompressAgain }: BatchResultsPanelProps) {
  const totalSaved = items.reduce((sum, item) => sum + item.result.originalSize - item.result.compressedSize, 0);

  return (
    <div className="animate-fade-up space-y-5 rounded-xl border border-border/60 bg-muted/25 p-6 ring-1 ring-white/[0.03] sm:p-8">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          {items.length === 1 ? "Your image is ready" : `${items.length} images compressed`}
        </h3>
        {items.length > 1 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Download each file below. Total size reduced by about {formatBytes(Math.max(0, totalSaved))}.
            {failedCount > 0 ? ` ${failedCount} image(s) could not be compressed.` : ""}
          </p>
        ) : null}
      </div>

      <ul className="divide-y divide-border rounded-md bg-card/80">
        {items.map((item) => (
          <li key={item.result.objectUrl} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium" title={item.sourceName}>{item.sourceName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatBytes(item.result.originalSize)} → {formatBytes(item.result.compressedSize)} ({item.result.savedPercent}%
                saved) · {formatLabel(item.result.outputFormat)}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={() => downloadResult(item.result)}
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </Button>
          </li>
        ))}
      </ul>

      {items.length > 1 ? (
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => {
            for (const item of items) {
              downloadResult(item.result);
            }
          }}
        >
          <Download className="size-4" aria-hidden="true" />
          Download all images
        </Button>
      ) : items[0] ? (
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={() => {
            const first = items[0];
            if (first) {
              downloadResult(first.result);
            }
          }}
        >
          <Download className="size-4" aria-hidden="true" />
          Download Image
        </Button>
      ) : null}

      {onCompressAgain ? (
        <Button variant="secondary" onClick={onCompressAgain} size="lg" className="w-full">
          <RotateCcw className="size-4" aria-hidden="true" />
          Compress again with same files
        </Button>
      ) : null}
      <Button variant="ghost" onClick={onReset} size="lg" className="w-full">
        Start over with new images
      </Button>
    </div>
  );
}
