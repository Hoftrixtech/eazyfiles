"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoginRequiredNotice } from "@/components/access/LoginRequiredNotice";
import { useAccessStatus } from "@/components/access/useAccessStatus";
import { ErrorAlert } from "@/components/compressor/ErrorAlert";
import { ProcessingState } from "@/components/compressor/ProcessingState";
import { SelectedFileCard } from "@/components/compressor/SelectedFileCard";
import { UploadDropzone } from "@/components/compressor/UploadDropzone";
import { ConvertFormatSelector } from "@/components/converter/ConvertFormatSelector";
import { ConvertQualitySelector } from "@/components/converter/ConvertQualitySelector";
import { ConvertResultCard } from "@/components/converter/ConvertResultCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { convertImageRequest, type ConvertClientResult } from "@/lib/client/convert-request";
import { ApiRequestError } from "@/lib/client/api-error";
import {
  guessImageFormat,
  isOversizedImageFile,
  isSupportedImageFile,
  preferredConvertTarget,
  readImageDimensions,
} from "@/lib/client/image-file";
import { DEFAULT_CONVERT_QUALITY, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { formatBytes, formatDimensions } from "@/lib/utils";
import type { SupportedImageFormat } from "@/types/compression";
import type { ConvertQuality } from "@/types/convert";

function formatLabel(format: SupportedImageFormat | null): string {
  if (format === "jpeg") {
    return "JPEG";
  }
  if (format === "png") {
    return "PNG";
  }
  if (format === "webp") {
    return "WebP";
  }
  return "Unknown";
}

export function ImageConverter() {
  const { status, refresh } = useAccessStatus();
  const toolState = status?.tools["image-converter"];
  const processingLocked = toolState === "auth-required";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [originalFormat, setOriginalFormat] = useState<SupportedImageFormat | null>(null);
  const [outputFormat, setOutputFormat] = useState<SupportedImageFormat>("webp");
  const [quality, setQuality] = useState<ConvertQuality>(DEFAULT_CONVERT_QUALITY);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertClientResult | null>(null);
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

  const handleFile = useCallback(
    async (nextFile: File) => {
      setError(null);
      resetResult();

      if (!isSupportedImageFile(nextFile)) {
        setFile(null);
        setOriginalSize(null);
        setOriginalFormat(null);
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
        setOriginalFormat(null);
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
        const detected = guessImageFormat(nextFile);
        setFile(nextFile);
        setOriginalSize(dimensions);
        setOriginalFormat(detected);
        setQuality(DEFAULT_CONVERT_QUALITY);
        setOutputFormat(detected ? preferredConvertTarget(detected) : "webp");
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return URL.createObjectURL(nextFile);
        });
      } catch {
        setFile(null);
        setOriginalSize(null);
        setOriginalFormat(null);
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return null;
        });
        setError("This file could not be read as a valid image.");
      }
    },
    [resetResult]
  );

  function handleRemove() {
    setFile(null);
    setOriginalSize(null);
    setOriginalFormat(null);
    setOutputFormat("webp");
    setQuality(DEFAULT_CONVERT_QUALITY);
    setError(null);
    resetResult();
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  async function handleConvert() {
    if (processingRef.current || !file || processingLocked) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setError(null);
    resetResult();

    try {
      const nextResult = await convertImageRequest({
        file,
        outputFormat,
        quality,
      });
      setResult(nextResult);
      await refresh();
    } catch (caught) {
      if (caught instanceof ApiRequestError && caught.code === "AUTH_REQUIRED") {
        await refresh();
      }
      const message = caught instanceof Error ? caught.message : "Conversion failed. Please try again.";
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

  const sameFormat = Boolean(originalFormat && originalFormat === outputFormat);
  const metaParts = [
    originalFormat ? `Original format ${formatLabel(originalFormat)}` : null,
    originalSize ? `Original dimensions ${formatDimensions(originalSize.width, originalSize.height)}` : null,
  ].filter(Boolean);

  return (
    <section id="converter" className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-5xl">
        <SectionHeader
          eyebrow="Free online image converter"
          title="Convert Images Online Between Popular Formats"
          description="Convert JPG, PNG, and WebP images online by choosing an output format and quality setting. Download the converted image while keeping the original dimensions."
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
                    multiple={false}
                    dragLabel="Drag & drop your image here"
                    chooseButtonLabel="Choose an Image"
                    supportedHint="Supported: JPG · PNG · WebP"
                  />
                ) : (
                  <SelectedFileCard
                    file={file}
                    previewUrl={previewUrl}
                    disabled={isProcessing}
                    onRemove={handleRemove}
                    meta={metaParts.length > 0 ? metaParts.join(" · ") : undefined}
                  />
                )}
              </div>
            </div>

            <ConvertFormatSelector
              value={outputFormat}
              disabled={isProcessing || !file}
              onChange={setOutputFormat}
              description="Convert your image to JPG, PNG, or WebP. The downloaded file uses the output format you select."
            />

            {sameFormat ? (
              <p
                className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                role="status"
              >
                This image is already {formatLabel(originalFormat)}. Converting to the same format re-encodes the file.
                Pick another format if you need a different type.
              </p>
            ) : null}

            <ConvertQualitySelector
              value={quality}
              disabled={isProcessing || !file}
              outputIsPng={outputFormat === "png"}
              onChange={setQuality}
            />

            {isProcessing ? <ProcessingState message="Converting your image…" /> : null}
            {toolState === "auth-required" ? (
              <LoginRequiredNotice
                nextPath="/tools/image-converter"
                useGoogleSignIn
                title="Sign In to Use the Image Converter"
                description="Create or sign in to your free EazyFiles account to convert your images."
                createAccountLabel="Create Account"
              />
            ) : null}
            {error && toolState !== "auth-required" ? <ErrorAlert message={error} /> : null}
            {result ? <ConvertResultCard result={result} onDownload={handleDownload} onReset={handleRemove} /> : null}

            {processingLocked ? null : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!file || isProcessing}
                aria-disabled={!file || isProcessing}
                onClick={() => {
                  void handleConvert();
                }}
              >
                {isProcessing ? "Converting…" : "Convert image"}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
