"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoginRequiredNotice } from "@/components/access/LoginRequiredNotice";
import { useAccessStatus } from "@/components/access/useAccessStatus";
import { ErrorAlert } from "@/components/compressor/ErrorAlert";
import { OutputFormatSelector } from "@/components/compressor/OutputFormatSelector";
import { ProcessingState } from "@/components/compressor/ProcessingState";
import { SelectedFileCard } from "@/components/compressor/SelectedFileCard";
import { UploadDropzone } from "@/components/compressor/UploadDropzone";
import { DimensionControls } from "@/components/resizer/DimensionControls";
import { ResizeResultCard } from "@/components/resizer/ResizeResultCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { isOversizedImageFile, isSupportedImageFile, readImageDimensions } from "@/lib/client/image-file";
import { ApiRequestError } from "@/lib/client/api-error";
import { resizeImageRequest, type ResizeClientResult } from "@/lib/client/resize-request";
import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS, MAX_UPLOAD_BYTES } from "@/lib/constants";
import {
  fitInside,
  isAllowedResizeSize,
  sizeFromHeight,
  sizeFromPercent,
  sizeFromWidth,
  type PixelSize,
} from "@/lib/resize/dimensions";
import { formatBytes, formatDimensions } from "@/lib/utils";
import type { OutputFormatOption } from "@/types/compression";

export function ImageResizer() {
  const { status, refresh } = useAccessStatus();
  const toolState = status?.tools["image-resizer"];
  const processingLocked = toolState === "auth-required";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<PixelSize | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [selectedPercent, setSelectedPercent] = useState<number | null>(100);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormatOption>("original");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResizeClientResult | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (result?.objectUrl) {
        URL.revokeObjectURL(result.objectUrl);
      }
    };
  }, [result]);

  const resetResult = useCallback(() => {
    if (result?.objectUrl) {
      URL.revokeObjectURL(result.objectUrl);
    }
    setResult(null);
  }, [result]);

  const applySize = useCallback((size: PixelSize, percent: number | null, preset: string | null) => {
    setWidth(String(size.width));
    setHeight(String(size.height));
    setSelectedPercent(percent);
    setSelectedPreset(preset);
  }, []);

  const handleFile = useCallback(
    async (nextFile: File) => {
      setError(null);
      resetResult();

      if (!isSupportedImageFile(nextFile)) {
        setFile(null);
        setOriginalSize(null);
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return null;
        });
        setError("Unsupported file. Please upload a JPG, PNG or WebP image.");
        return;
      }

      if (isOversizedImageFile(nextFile)) {
        setFile(null);
        setOriginalSize(null);
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return null;
        });
        setError(`File too large. The maximum upload size is ${formatBytes(MAX_UPLOAD_BYTES)}.`);
        return;
      }

      try {
        const dimensions = await readImageDimensions(nextFile);
        setFile(nextFile);
        setOriginalSize(dimensions);
        applySize(dimensions, 100, null);
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return URL.createObjectURL(nextFile);
        });
      } catch {
        setFile(null);
        setOriginalSize(null);
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return null;
        });
        setError("This file could not be read as a valid image.");
      }
    },
    [applySize, resetResult]
  );

  function handleRemove() {
    setFile(null);
    setOriginalSize(null);
    setWidth("");
    setHeight("");
    setSelectedPercent(100);
    setSelectedPreset(null);
    setMaintainAspect(true);
    setOutputFormat("original");
    setError(null);
    resetResult();
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  function handleWidthChange(value: string) {
    setWidth(value);
    setSelectedPercent(null);
    setSelectedPreset(null);
    const parsed = Number(value);
    if (!originalSize || !maintainAspect || !Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    const next = sizeFromWidth(originalSize, parsed);
    setHeight(String(next.height));
  }

  function handleHeightChange(value: string) {
    setHeight(value);
    setSelectedPercent(null);
    setSelectedPreset(null);
    const parsed = Number(value);
    if (!originalSize || !maintainAspect || !Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    const next = sizeFromHeight(originalSize, parsed);
    setWidth(String(next.width));
  }

  function handleMaintainAspectChange(value: boolean) {
    setMaintainAspect(value);
    if (!value || !originalSize) {
      return;
    }
    const parsedWidth = Number(width);
    if (Number.isFinite(parsedWidth) && parsedWidth > 0) {
      const next = sizeFromWidth(originalSize, parsedWidth);
      applySize(next, null, null);
    }
  }

  function handlePercentChange(percent: number) {
    if (!originalSize) {
      return;
    }
    applySize(sizeFromPercent(originalSize, percent), percent, null);
  }

  function handlePresetChange(presetWidth: number, presetHeight: number, label: string) {
    if (!originalSize) {
      return;
    }
    if (maintainAspect) {
      applySize(fitInside(originalSize, { width: presetWidth, height: presetHeight }), null, label);
      return;
    }
    applySize({ width: presetWidth, height: presetHeight }, null, label);
  }

  async function handleResize() {
    if (processingRef.current || !file || processingLocked) {
      return;
    }

    const parsedWidth = Number(width);
    const parsedHeight = Number(height);
    if (!Number.isInteger(parsedWidth) || !Number.isInteger(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) {
      setError("Enter a whole-number width and height greater than zero.");
      return;
    }

    if (!isAllowedResizeSize(parsedWidth, parsedHeight)) {
      setError(
        `Choose dimensions between 1 and ${MAX_RESIZE_EDGE} pixels, with no more than ${MAX_RESIZE_PIXELS.toLocaleString()} pixels in total.`
      );
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setError(null);
    resetResult();

    try {
      const nextResult = await resizeImageRequest({
        file,
        width: parsedWidth,
        height: parsedHeight,
        outputFormat,
      });
      setResult(nextResult);
      await refresh();
    } catch (caught) {
      if (caught instanceof ApiRequestError && caught.code === "AUTH_REQUIRED") {
        await refresh();
      }
      const message = caught instanceof Error ? caught.message : "Resizing failed. Please try again.";
      setError(message);
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }

  function handleDownload() {
    if (!result) {
      return;
    }

    const link = document.createElement("a");
    link.href = result.objectUrl;
    link.download = result.filename.replace(/[\r\n"]/g, "");
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <section id="resizer" className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-5xl">
        <SectionHeader
          eyebrow="Free online image resizer"
          title="Resize Images Online to Your Dimensions"
          description="Upload a JPG, PNG, or WebP image, set custom width and height, scale by percentage, or choose a common preset. Keep the aspect ratio to maintain the original proportions, then download your resized image."
        />

        <Card className="glass-panel mx-auto mt-10 max-w-3xl p-5 sm:p-8 lg:p-10" aria-busy={isProcessing}>
          <div className="min-w-0 space-y-8">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Upload your image</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or WebP · Up to {formatBytes(MAX_UPLOAD_BYTES)}</p>
              <div className="mt-5">
                {!file || !previewUrl ? (
                  <UploadDropzone
                    disabled={isProcessing}
                    onFile={(nextFile) => {
                      void handleFile(nextFile);
                    }}
                    isDragging={isDragging}
                    onDraggingChange={setIsDragging}
                    dragLabel="Drag & drop your images here"
                    chooseButtonLabel="Choose Images"
                    supportedHint="Supported: JPG · PNG · WebP · Multiple files OK"
                  />
                ) : (
                  <SelectedFileCard
                    file={file}
                    previewUrl={previewUrl}
                    disabled={isProcessing}
                    onRemove={handleRemove}
                    meta={
                      originalSize
                        ? `Original dimensions ${formatDimensions(originalSize.width, originalSize.height)}`
                        : undefined
                    }
                  />
                )}
              </div>
            </div>

            <DimensionControls
              width={width}
              height={height}
              maintainAspect={maintainAspect}
              selectedPercent={selectedPercent}
              selectedPreset={selectedPreset}
              disabled={isProcessing || !file}
              originalLabel={originalSize ? formatDimensions(originalSize.width, originalSize.height) : undefined}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
              onMaintainAspectChange={handleMaintainAspectChange}
              onPercentChange={handlePercentChange}
              onPresetChange={handlePresetChange}
            />

            <OutputFormatSelector
              value={outputFormat}
              disabled={isProcessing || !file}
              onChange={setOutputFormat}
              description="Keep the original format, or convert the resized image to JPG, PNG, or WebP."
            />

            {isProcessing ? <ProcessingState message="Resizing your image…" /> : null}
            {toolState === "auth-required" ? (
              <LoginRequiredNotice
                nextPath="/tools/image-resizer"
                useGoogleSignIn
                title="Sign in to use the Image Resizer"
                description="Create or sign in to your free EazyFiles account to resize your images."
                createAccountLabel="Create Account"
              />
            ) : null}
            {error && toolState !== "auth-required" ? <ErrorAlert message={error} /> : null}
            {result ? <ResizeResultCard result={result} onDownload={handleDownload} onReset={handleRemove} /> : null}

            {processingLocked ? null : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!file || isProcessing}
                aria-disabled={!file || isProcessing}
                onClick={() => {
                  void handleResize();
                }}
              >
                {isProcessing ? "Resizing…" : "Resize image"}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
