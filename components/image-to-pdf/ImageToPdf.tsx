"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoginRequiredNotice } from "@/components/access/LoginRequiredNotice";
import { useAccessStatus } from "@/components/access/useAccessStatus";
import { ErrorAlert } from "@/components/compressor/ErrorAlert";
import { ProcessingState } from "@/components/compressor/ProcessingState";
import { UploadDropzone } from "@/components/compressor/UploadDropzone";
import { PdfLayoutSelector } from "@/components/image-to-pdf/PdfLayoutSelector";
import { PdfResultCard } from "@/components/image-to-pdf/PdfResultCard";
import { SelectedImagesList } from "@/components/image-to-pdf/SelectedImagesList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ApiRequestError } from "@/lib/client/api-error";
import { imageToPdfRequest, type ImageToPdfClientResult } from "@/lib/client/image-to-pdf-request";
import { isOversizedImageFile, isSupportedImageFile } from "@/lib/client/image-file";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";
import type { PdfPageLayout } from "@/types/pdf";

export function ImageToPdf() {
  const { status, refresh } = useAccessStatus();
  const toolState = status?.tools["image-to-pdf"];
  const processingLocked = toolState === "auth-required";
  const [files, setFiles] = useState<File[]>([]);
  const [pageLayout, setPageLayout] = useState<PdfPageLayout>("image-size");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageToPdfClientResult | null>(null);
  const processingRef = useRef(false);

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

  const addFiles = useCallback(
    (incoming: File[]) => {
      setError(null);
      resetResult();

      const next: File[] = [...files];
      for (const file of incoming) {
        if (!isSupportedImageFile(file)) {
          setError("Unsupported file. Please upload JPG, PNG or WebP images only.");
          return;
        }
        if (isOversizedImageFile(file)) {
          setError(`Each image must be ${formatBytes(MAX_UPLOAD_BYTES)} or smaller.`);
          return;
        }
        next.push(file);
      }
      setFiles(next);
    },
    [files, resetResult]
  );

  function handleClear() {
    setFiles([]);
    setError(null);
    resetResult();
  }

  function handleRemove(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
    resetResult();
  }

  async function handleCreatePdf() {
    if (processingRef.current || files.length === 0 || processingLocked) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setError(null);
    resetResult();

    try {
      const nextResult = await imageToPdfRequest({ files, pageLayout });
      setResult(nextResult);
      await refresh();
    } catch (caught) {
      if (caught instanceof ApiRequestError && caught.code === "AUTH_REQUIRED") {
        await refresh();
      }
      const message = caught instanceof Error ? caught.message : "PDF creation failed. Please try again.";
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
    <section id="image-to-pdf" className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-5xl">
        <SectionHeader
          eyebrow="Free image to PDF converter"
          title="Turn Images Into a PDF Online"
          description="Upload one or more JPG, PNG, or WebP images and download a single PDF. Each image becomes its own page in the order you add them."
        />

        <Card className="glass-panel mx-auto mt-10 max-w-3xl p-5 sm:p-8 lg:p-10" aria-busy={isProcessing}>
          <div className="min-w-0 space-y-8">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Upload images</p>
              <p className="mt-1 text-sm text-muted-foreground">
                JPG, PNG or WebP · Up to {formatBytes(MAX_UPLOAD_BYTES)} each · Add as many images as you need
              </p>
              <div className="mt-5">
                <UploadDropzone
                  disabled={isProcessing}
                  onFiles={(picked) => {
                    addFiles(picked);
                  }}
                  isDragging={isDragging}
                  onDraggingChange={setIsDragging}
                  multiple
                  dragLabel="Drag & drop images here"
                  chooseButtonLabel="Choose Images"
                  supportedHint="Supported: JPG · PNG · WebP · Multiple files OK"
                />
                <SelectedImagesList
                  files={files}
                  disabled={isProcessing}
                  onRemove={handleRemove}
                  onClear={handleClear}
                />
              </div>
            </div>

            <PdfLayoutSelector
              value={pageLayout}
              disabled={isProcessing || files.length === 0}
              onChange={setPageLayout}
            />

            {isProcessing ? <ProcessingState message="Building your PDF…" /> : null}
            {toolState === "auth-required" ? (
              <LoginRequiredNotice
                nextPath="/tools/image-to-pdf"
                useGoogleSignIn
                title="Sign In to Use Image to PDF"
                description="Create or sign in to your free EazyFiles account to convert images to PDF."
                createAccountLabel="Create Account"
              />
            ) : null}
            {error && toolState !== "auth-required" ? <ErrorAlert message={error} /> : null}
            {result ? <PdfResultCard result={result} onDownload={handleDownload} onReset={handleClear} /> : null}

            {processingLocked ? null : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={files.length === 0 || isProcessing}
                aria-disabled={files.length === 0 || isProcessing}
                onClick={() => {
                  void handleCreatePdf();
                }}
              >
                {isProcessing ? "Creating PDF…" : "Create PDF"}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
