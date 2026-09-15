"use client";

import { useEffect, useRef } from "react";
import type { CropRegion } from "@/types/crop";

interface CropLivePreviewProps {
  previewUrl: string;
  crop: CropRegion;
}

export function CropLivePreview({ previewUrl, crop }: CropLivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const image = new Image();
    let cancelled = false;

    image.onload = () => {
      if (cancelled) {
        return;
      }

      const maxEdge = 160;
      const ratio = crop.width > 0 ? crop.height / crop.width : 1;
      const width = crop.width >= crop.height ? maxEdge : Math.max(1, Math.round(maxEdge / ratio));
      const height = crop.height >= crop.width ? maxEdge : Math.max(1, Math.round(maxEdge * ratio));
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.clearRect(0, 0, width, height);
      context.drawImage(
        image,
        crop.x,
        crop.y,
        Math.max(1, crop.width),
        Math.max(1, crop.height),
        0,
        0,
        width,
        height
      );
    };

    image.src = previewUrl;

    return () => {
      cancelled = true;
    };
  }, [crop.height, crop.width, crop.x, crop.y, previewUrl]);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Crop preview</p>
      <canvas
        ref={canvasRef}
        aria-label="Live preview of the selected crop"
        className="mx-auto max-h-40 w-full rounded-md border border-border bg-muted object-contain"
      />
    </div>
  );
}
