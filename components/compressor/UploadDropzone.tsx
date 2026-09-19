"use client";

import { useId, useRef, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { ACCEPTED_FILE_INPUT, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { cn, formatBytes } from "@/lib/utils";

interface UploadDropzoneProps {
  disabled?: boolean;
  /** Batch upload (compressor). */
  onFiles?: (files: File[]) => void;
  /** Single file (other tools). */
  onFile?: (file: File) => void;
  isDragging: boolean;
  onDraggingChange: (dragging: boolean) => void;
  multiple?: boolean;
}

export function UploadDropzone({
  disabled = false,
  onFiles,
  onFile,
  isDragging,
  onDraggingChange,
  multiple = true,
}: UploadDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function takeFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }
    const files = Array.from(fileList);
    if (onFiles) {
      onFiles(files);
      return;
    }
    const first = files[0];
    if (onFile && first) {
      onFile(first);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    onDraggingChange(false);
    if (disabled) {
      return;
    }
    takeFiles(event.dataTransfer.files);
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) {
          onDraggingChange(true);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (event.currentTarget.contains(event.relatedTarget as Node)) {
          return;
        }
        onDraggingChange(false);
      }}
      onDrop={handleDrop}
      className={cn(
        "min-h-52 rounded-xl border-2 border-dashed px-4 py-12 text-center transition-all duration-200 sm:px-8",
        isDragging
          ? "border-primary/40 bg-muted ring-2 ring-primary/15"
          : "border-border bg-muted/50 hover:border-primary/25 hover:bg-muted",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_FILE_INPUT}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        aria-describedby={`${inputId}-help`}
        onChange={(event) => {
          takeFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-card text-primary">
        <Upload className="size-5" aria-hidden="true" />
      </span>
      <p className="text-base font-medium">
        {multiple ? "Drag & drop your images here" : "Drag & drop your image here"}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">or</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-label="Choose JPG, PNG or WebP images"
        className="mt-4 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/88 disabled:opacity-60"
      >
        {multiple ? "Choose Images" : "Choose an Image"}
      </button>
      <p id={`${inputId}-help`} className="mt-6 text-xs tracking-wide text-muted-foreground uppercase">
        Supported: JPG • PNG • WebP{multiple ? " · Multiple files OK" : ""}
      </p>
      <p className="sr-only">Maximum upload size per file {formatBytes(MAX_UPLOAD_BYTES)}.</p>
    </div>
  );
}
