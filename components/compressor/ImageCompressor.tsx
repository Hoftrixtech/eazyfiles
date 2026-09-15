"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CompressorLimitNotice } from "@/components/access/CompressorLimitNotice";
import { useAccessStatus } from "@/components/access/useAccessStatus";
import { BatchResultsPanel, type BatchResultItem } from "@/components/compressor/BatchResultsPanel";
import { ErrorAlert } from "@/components/compressor/ErrorAlert";
import { OutputFormatSelector } from "@/components/compressor/OutputFormatSelector";
import { ProcessingState } from "@/components/compressor/ProcessingState";
import { SelectedFilesList, type SelectedFileEntry } from "@/components/compressor/SelectedFilesList";
import { TargetSizeSelector } from "@/components/compressor/TargetSizeSelector";
import { UploadDropzone } from "@/components/compressor/UploadDropzone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ApiRequestError } from "@/lib/client/api-error";
import { compressImageRequest } from "@/lib/client/compress-request";
import { isGenericUploadMime } from "@/lib/compression/formats";
import {
  DEFAULT_TARGET_BYTES,
  ACCEPTED_FILE_INPUT,
  MAX_COMPRESSOR_BATCH_FILES,
  MAX_TARGET_BYTES,
  MAX_UPLOAD_BYTES,
  MIN_TARGET_BYTES,
  SUPPORTED_EXTENSIONS,
  SUPPORTED_MIME_TYPES,
  TARGET_PRESETS,
} from "@/lib/constants";
import { formatBytes, getFileExtension } from "@/lib/utils";
import type { OutputFormatOption } from "@/types/compression";

function isSupportedFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  const mime = file.type.toLowerCase();
  const mimeOk =
    isGenericUploadMime(mime) ||
    SUPPORTED_MIME_TYPES.includes(mime as (typeof SUPPORTED_MIME_TYPES)[number]);
  const extensionOk =
    !extension || SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number]);
  return mimeOk && extensionOk;
}

function createEntryId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function revokeEntries(entries: SelectedFileEntry[]) {
  for (const entry of entries) {
    URL.revokeObjectURL(entry.previewUrl);
  }
}

function revokeResults(items: BatchResultItem[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.result.objectUrl);
  }
}

export function ImageCompressor({ id = "compressor" }: { id?: string }) {
  const { status, refresh } = useAccessStatus();
  const [entries, setEntries] = useState<SelectedFileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [presetBytes, setPresetBytes] = useState<number | null>(DEFAULT_TARGET_BYTES);
  const [customValue, setCustomValue] = useState("100");
  const [customUnit, setCustomUnit] = useState<"KB" | "MB">("KB");
  const [outputFormat, setOutputFormat] = useState<OutputFormatOption>("original");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [batchIndex, setBatchIndex] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([]);
  const [failedCount, setFailedCount] = useState(0);
  const processingRef = useRef(false);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const compressorLocked = Boolean(status && status.compressor.mode === "anonymous" && !status.compressor.allowed);

  const entriesRef = useRef(entries);
  const resultsRef = useRef(batchResults);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    resultsRef.current = batchResults;
  }, [batchResults]);

  useEffect(() => {
    return () => {
      revokeEntries(entriesRef.current);
      revokeResults(resultsRef.current);
    };
  }, []);

  const targetBytes = useMemo(() => {
    if (presetBytes !== null) {
      return presetBytes;
    }

    const parsed = Number(customValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return customUnit === "MB" ? Math.round(parsed * 1024 * 1024) : Math.round(parsed * 1024);
  }, [customUnit, customValue, presetBytes]);

  const resetResults = useCallback(() => {
    setBatchResults((current) => {
      revokeResults(current);
      return [];
    });
    setFailedCount(0);
  }, []);

  const clearEntries = useCallback(() => {
    setEntries((current) => {
      revokeEntries(current);
      return [];
    });
  }, []);

  const handleIncomingFiles = useCallback(
    (incoming: File[]) => {
      setError(null);
      resetResults();

      const rejected: string[] = [];
      const accepted: SelectedFileEntry[] = [];

      for (const nextFile of incoming) {
        if (!isSupportedFile(nextFile)) {
          rejected.push(`${nextFile.name}: unsupported format`);
          continue;
        }
        if (nextFile.size > MAX_UPLOAD_BYTES) {
          rejected.push(`${nextFile.name}: exceeds ${formatBytes(MAX_UPLOAD_BYTES)}`);
          continue;
        }
        accepted.push({
          id: createEntryId(),
          file: nextFile,
          previewUrl: URL.createObjectURL(nextFile),
        });
      }

      if (accepted.length === 0 && rejected.length > 0) {
        setError(rejected[0] ?? "Could not add files. Use JPG, PNG or WebP.");
        return;
      }

      setEntries((current) => {
        const merged = [...current, ...accepted];
        if (merged.length > MAX_COMPRESSOR_BATCH_FILES) {
          const kept = merged.slice(0, MAX_COMPRESSOR_BATCH_FILES);
          const dropped = merged.slice(MAX_COMPRESSOR_BATCH_FILES);
          revokeEntries(dropped);
          setError(`Only the first ${MAX_COMPRESSOR_BATCH_FILES} images are kept per batch.`);
          return kept;
        }
        if (rejected.length > 0) {
          setError(`Some files were skipped: ${rejected.slice(0, 3).join("; ")}${rejected.length > 3 ? "…" : ""}`);
        }
        return merged;
      });
    },
    [resetResults]
  );

  function handleRemoveEntry(entryId: string) {
    setEntries((current) => {
      const removed = current.find((e) => e.id === entryId);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return current.filter((e) => e.id !== entryId);
    });
    setError(null);
    resetResults();
  }

  function handleClearAll() {
    clearEntries();
    setError(null);
    resetResults();
  }

  function handlePresetChange(bytes: number) {
    setPresetBytes(bytes);
    const preset = TARGET_PRESETS.find((item) => item.bytes === bytes);
    if (preset?.label.endsWith("MB")) {
      setCustomUnit("MB");
      setCustomValue(String(bytes / (1024 * 1024)));
    } else {
      setCustomUnit("KB");
      setCustomValue(String(Math.round(bytes / 1024)));
    }
  }

  function handleCustomValueChange(value: string) {
    setCustomValue(value);
    setPresetBytes(null);
  }

  function handleCustomUnitChange(unit: "KB" | "MB") {
    setCustomUnit(unit);
    setPresetBytes(null);
  }

  function handleFullReset() {
    clearEntries();
    setError(null);
    resetResults();
  }

  async function handleCompress() {
    if (processingRef.current || entries.length === 0 || compressorLocked) {
      return;
    }

    if (targetBytes === null) {
      setError("Enter a valid custom target size.");
      return;
    }

    if (targetBytes < MIN_TARGET_BYTES) {
      setError(`Choose a target of at least ${formatBytes(MIN_TARGET_BYTES)}.`);
      return;
    }

    if (targetBytes > MAX_TARGET_BYTES) {
      setError(`Choose a target of ${formatBytes(MAX_TARGET_BYTES)} or less.`);
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setCompressProgress(0);
    setBatchIndex(0);
    setBatchTotal(entries.length);
    setError(null);
    resetResults();

    const queue = [...entries];
    const completed: BatchResultItem[] = [];
    let failures = 0;
    let stoppedForLimit = false;

    try {
      for (let index = 0; index < queue.length; index += 1) {
        const entry = queue[index];
        if (!entry) {
          continue;
        }
        setBatchIndex(index + 1);

        try {
          const nextResult = await compressImageRequest({
            file: entry.file,
            targetSize: targetBytes,
            outputFormat,
            onProgress: (fileProgress) => {
              const overall = Math.round(((index + fileProgress / 100) / queue.length) * 100);
              setCompressProgress(overall);
            },
          });
          completed.push({ sourceName: entry.file.name, result: nextResult });
          await refresh();
        } catch (caught) {
          if (caught instanceof ApiRequestError && caught.code === "ANONYMOUS_LIMIT_REACHED") {
            stoppedForLimit = true;
            await refresh();
            failures += queue.length - index;
            setError(caught.message);
            break;
          }
          failures += 1;
          const message = caught instanceof Error ? caught.message : "Compression failed.";
          setError(
            queue.length > 1
              ? `${entry.file.name}: ${message}`
              : message
          );
        }
      }

      setFailedCount(failures);
      if (completed.length > 0) {
        setBatchResults(completed);
      } else if (!stoppedForLimit && failures > 0) {
        setError("No images were compressed. Check your files and try again.");
      }
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
      setCompressProgress(0);
      setBatchIndex(0);
      setBatchTotal(0);
    }
  }

  const showDropzone = entries.length === 0;
  const hasResults = batchResults.length > 0;
  const compressLabel =
    entries.length > 1 ? `Compress ${entries.length} Images` : entries.length === 1 ? "Compress Image" : "Compress Image";

  return (
    <section id={id} className="section-padding scroll-mt-24 border-b border-border bg-background pt-10 sm:pt-12" aria-labelledby={`${id}-title`}>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">Image Compressor</h2>
          <p className="mt-2 text-muted-foreground">Reduce your images to the size you need. Add one or many at once.</p>
        </div>
        <Card className="mx-auto mt-8 max-w-3xl p-5 sm:p-8 lg:p-10" aria-busy={isProcessing}>
          <div className="space-y-8">
            {showDropzone ? (
              <UploadDropzone
                disabled={isProcessing}
                onFiles={handleIncomingFiles}
                isDragging={isDragging}
                onDraggingChange={setIsDragging}
              />
            ) : (
              <>
                <SelectedFilesList
                  entries={entries}
                  disabled={isProcessing}
                  onRemove={handleRemoveEntry}
                  onClearAll={handleClearAll}
                  onAddMore={() => addMoreInputRef.current?.click()}
                />
                <input
                  ref={addMoreInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_INPUT}
                  multiple
                  className="sr-only"
                  tabIndex={-1}
                  disabled={isProcessing}
                  onChange={(event) => {
                    const list = event.target.files;
                    if (list?.length) {
                      handleIncomingFiles(Array.from(list));
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </>
            )}

            <TargetSizeSelector
              presetBytes={presetBytes}
              customValue={customValue}
              customUnit={customUnit}
              disabled={isProcessing}
              onPresetChange={handlePresetChange}
              onCustomValueChange={handleCustomValueChange}
              onCustomUnitChange={handleCustomUnitChange}
              onCustomSelect={() => setPresetBytes(null)}
            />

            <OutputFormatSelector value={outputFormat} disabled={isProcessing} onChange={setOutputFormat} />

            {status?.compressor.mode === "anonymous" && status.compressor.allowed ? (
              <p className="text-sm text-muted-foreground">
                {status.compressor.remaining} of {status.compressor.limit} free compressions remaining. Each image in a
                batch uses one compression.
              </p>
            ) : null}

            {isProcessing ? (
              <ProcessingState
                message={
                  batchTotal > 1
                    ? `Compressing image ${batchIndex} of ${batchTotal}…`
                    : "Compressing your image..."
                }
                progress={compressProgress}
                detail={batchTotal > 1 ? "Images are processed one at a time." : undefined}
              />
            ) : null}
            {compressorLocked ? <CompressorLimitNotice /> : null}
            {error && !compressorLocked ? <ErrorAlert message={error} /> : null}
            {hasResults ? <BatchResultsPanel items={batchResults} failedCount={failedCount} onReset={handleFullReset} /> : null}

            {compressorLocked || hasResults ? null : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={entries.length === 0 || isProcessing}
                aria-disabled={entries.length === 0 || isProcessing}
                onClick={() => {
                  void handleCompress();
                }}
              >
                {isProcessing ? "Compressing…" : compressLabel}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
