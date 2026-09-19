"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

export function SelectedImagesList({
  files,
  disabled,
  onRemove,
  onClear,
}: {
  files: File[];
  disabled?: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
}) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          {files.length} image{files.length === 1 ? "" : "s"} selected
        </p>
        <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onClear}>
          Clear all
        </Button>
      </div>
      <ul className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-border bg-card/50 p-2">
        {files.map((file, index) => (
          <li
            key={`${file.name}-${file.size}-${index}`}
            className="flex items-center gap-3 rounded-md bg-background px-3 py-2 text-sm"
          >
            <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
            <span className="shrink-0 text-muted-foreground">{formatBytes(file.size)}</span>
            <button
              type="button"
              disabled={disabled}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              aria-label={`Remove ${file.name}`}
              onClick={() => onRemove(index)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">Page order matches the list above.</p>
    </div>
  );
}
