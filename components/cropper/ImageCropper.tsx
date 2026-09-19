"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoginRequiredNotice } from "@/components/access/LoginRequiredNotice";
import { useAccessStatus } from "@/components/access/useAccessStatus";
import { ErrorAlert } from "@/components/compressor/ErrorAlert";
import { OutputFormatSelector } from "@/components/compressor/OutputFormatSelector";
import { ProcessingState } from "@/components/compressor/ProcessingState";
import { SelectedFileCard } from "@/components/compressor/SelectedFileCard";
import { UploadDropzone } from "@/components/compressor/UploadDropzone";
import { AspectRatioSelector } from "@/components/cropper/AspectRatioSelector";
import { CropLivePreview } from "@/components/cropper/CropLivePreview";
import { CropResultCard } from "@/components/cropper/CropResultCard";
import { CropStage } from "@/components/cropper/CropStage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { isOversizedImageFile, isSupportedImageFile, readImageDimensions } from "@/lib/client/image-file";
import { ApiRequestError } from "@/lib/client/api-error";
import { cropImageRequest, type CropClientResult } from "@/lib/client/crop-request";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import {
  clampCropRegion,
  defaultCropRegion,
  getAspectValue,
  isValidCropRegion,
  roundRegion,
  uiMinCropEdge,
} from "@/lib/crop/region";
import { formatBytes, formatDimensions } from "@/lib/utils";
import type { OutputFormatOption } from "@/types/compression";
import type { CropAspectId, CropRegion } from "@/types/crop";

export function ImageCropper() {
  const { status, refresh } = useAccessStatus();
  const toolState = status?.tools["image-cropper"];
  const processingLocked = toolState === "auth-required";
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [crop, setCrop] = useState<CropRegion | null>(null);
  const [aspectId, setAspectId] = useState<CropAspectId>("free");
  const [outputFormat, setOutputFormat] = useState<OutputFormatOption>("original");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropClientResult | null>(null);
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
        setCrop(null);
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
        setCrop(null);
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
        const minEdge = uiMinCropEdge(dimensions.width, dimensions.height);
        setFile(nextFile);
        setOriginalSize(dimensions);
        setAspectId("free");
        setCrop(defaultCropRegion(dimensions.width, dimensions.height, null, minEdge));
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }
          return URL.createObjectURL(nextFile);
        });
      } catch {
        setFile(null);
        setOriginalSize(null);
        setCrop(null);
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
    setCrop(null);
    setAspectId("free");
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

  function handleAspectChange(nextId: CropAspectId) {
    setAspectId(nextId);
    if (!originalSize) {
      return;
    }
    const minEdge = uiMinCropEdge(originalSize.width, originalSize.height);
    setCrop(defaultCropRegion(originalSize.width, originalSize.height, getAspectValue(nextId), minEdge));
  }

  async function handleCrop() {
    if (processingRef.current || !file || !crop || !originalSize || processingLocked) {
      return;
    }

    const region = roundRegion(crop);
    if (!isValidCropRegion(region, originalSize.width, originalSize.height)) {
      setError("Adjust the crop area so it stays inside the image.");
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setError(null);
    resetResult();

    try {
      const nextResult = await cropImageRequest({
        file,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        outputFormat,
      });
      setResult(nextResult);
      await refresh();
    } catch (caught) {
      if (caught instanceof ApiRequestError && caught.code === "AUTH_REQUIRED") {
        await refresh();
      }
      const message = caught instanceof Error ? caught.message : "Cropping failed. Please try again.";
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
    <section id="cropper" className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-5xl">
        <SectionHeader
          eyebrow="Free online image cropper"
          title="Crop Images Online to the Area You Need"
          description="Upload a JPG, PNG, or WebP image, select the area you want to keep, choose an available aspect ratio or crop freely, and download your cropped image."
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
                    meta={
                      originalSize
                        ? `Original dimensions ${formatDimensions(originalSize.width, originalSize.height)}`
                        : undefined
                    }
                  />
                )}
              </div>
            </div>

            {file && previewUrl && originalSize && crop ? (
              <div className="space-y-8">
                <CropStage
                  previewUrl={previewUrl}
                  imageWidth={originalSize.width}
                  imageHeight={originalSize.height}
                  crop={crop}
                  aspect={getAspectValue(aspectId)}
                  disabled={isProcessing}
                  onChange={(next) => {
                    setCrop(
                      clampCropRegion(
                        next,
                        originalSize.width,
                        originalSize.height,
                        getAspectValue(aspectId),
                        uiMinCropEdge(originalSize.width, originalSize.height)
                      )
                    );
                  }}
                />
                <AspectRatioSelector value={aspectId} disabled={isProcessing} onChange={handleAspectChange} />
                <CropLivePreview previewUrl={previewUrl} crop={crop} />
              </div>
            ) : null}

            <OutputFormatSelector
              value={outputFormat}
              disabled={isProcessing || !file}
              onChange={setOutputFormat}
              description="Keep the original format, or convert the cropped image to JPG, WebP, or PNG."
            />

            {isProcessing ? <ProcessingState message="Cropping your image…" /> : null}
            {toolState === "auth-required" ? (
              <LoginRequiredNotice
                nextPath="/tools/image-cropper"
                useGoogleSignIn
                title="Sign in to use the Image Cropper"
                description="Create or sign in to your free EazyFiles account to crop your images."
                createAccountLabel="Create Account"
              />
            ) : null}
            {error && toolState !== "auth-required" ? <ErrorAlert message={error} /> : null}
            {result ? <CropResultCard result={result} onDownload={handleDownload} onReset={handleRemove} /> : null}

            {processingLocked ? null : (
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!file || isProcessing}
                aria-disabled={!file || isProcessing}
                onClick={() => {
                  void handleCrop();
                }}
              >
                {isProcessing ? "Cropping…" : "Crop image"}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
