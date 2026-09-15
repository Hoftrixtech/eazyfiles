"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

export interface SelectedFileEntry {
  id: string;
  file: File;
  previewUrl: string;
}

interface SelectedFilesListProps {
  entries: SelectedFileEntry[];
  disabled?: boolean;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onAddMore?: () => void;
}

export function SelectedFilesList({ entries, disabled, onRemove, onClearAll, onAddMore }: SelectedFilesListProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {entries.length} image{entries.length === 1 ? "" : "s"} selected
        </p>
        <div className="flex gap-2">
          {onAddMore ? (
            <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={onAddMore}>
              Add more
            </Button>
          ) : null}
          <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={onClearAll}>
            Clear all
          </Button>
        </div>
      </div>
      <ul className="max-h-72 space-y-2 overflow-y-auto rounded-md bg-muted/30 p-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center gap-3 rounded-md bg-card/80 p-2 sm:p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.previewUrl}
              alt=""
              className="size-14 shrink-0 rounded-sm object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={entry.file.name}>{entry.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(entry.file.size)}</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => onRemove(entry.id)}
              aria-label={`Remove ${entry.file.name}`}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
