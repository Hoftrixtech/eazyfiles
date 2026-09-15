"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

interface SelectedFileCardProps {
  file: File;
  previewUrl: string;
  disabled?: boolean;
  onRemove: () => void;
  meta?: string;
}

export function SelectedFileCard({ file, previewUrl, disabled, onRemove, meta }: SelectedFileCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-muted/40 p-4 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt={`Preview of ${file.name}`}
        className="h-28 w-full rounded-md object-cover sm:h-24 sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium" title={file.name}>
          {file.name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Original size {formatBytes(file.size)}</p>
        {meta ? <p className="mt-1 text-sm text-muted-foreground">{meta}</p> : null}
      </div>
      <Button variant="secondary" size="sm" onClick={onRemove} disabled={disabled} aria-label="Remove selected image">
        <X className="size-4" aria-hidden="true" />
        Remove
      </Button>
    </div>
  );
}
