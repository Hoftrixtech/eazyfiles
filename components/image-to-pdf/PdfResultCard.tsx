"use client";

import { Download, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import type { ImageToPdfClientResult } from "@/lib/client/image-to-pdf-request";
import { PDF_PAGE_LAYOUT_OPTIONS } from "@/types/pdf";

interface PdfResultCardProps {
  result: ImageToPdfClientResult;
  onDownload: () => void;
  onReset: () => void;
}

function layoutLabel(layout: ImageToPdfClientResult["pageLayout"]): string {
  return PDF_PAGE_LAYOUT_OPTIONS.find((option) => option.id === layout)?.label ?? layout;
}

export function PdfResultCard({ result, onDownload, onReset }: PdfResultCardProps) {
  return (
    <div className="animate-fade-up space-y-5 rounded-md border border-border bg-muted/30 p-5">
      <div>
        <h3 className="font-medium">PDF ready</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.pageCount} page{result.pageCount === 1 ? "" : "s"} · {layoutLabel(result.pageLayout)}
        </p>
      </div>
      <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-card py-10">
        <FileText className="size-16 text-primary/80" aria-hidden="true" />
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">Source images</dt>
          <dd className="mt-1 font-medium">{formatBytes(result.originalSize)}</dd>
        </div>
        <div className="rounded-md bg-card p-3">
          <dt className="text-xs text-muted-foreground">PDF size</dt>
          <dd className="mt-1 font-medium">{formatBytes(result.outputSize)}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">{result.filename}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onDownload} className="sm:flex-1" aria-label="Download PDF">
          <Download className="size-4" aria-hidden="true" />
          Download PDF
        </Button>
        <Button variant="secondary" onClick={onReset} className="sm:flex-1">
          <RotateCcw className="size-4" aria-hidden="true" />
          Create Another PDF
        </Button>
      </div>
    </div>
  );
}
