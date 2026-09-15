"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { applyHandle, uiMinCropEdge } from "@/lib/crop/region";
import { formatDimensions } from "@/lib/utils";
import type { CropHandle, CropRegion } from "@/types/crop";

interface CropStageProps {
  previewUrl: string;
  imageWidth: number;
  imageHeight: number;
  crop: CropRegion;
  aspect: number | null;
  disabled?: boolean;
  onChange: (region: CropRegion) => void;
}

const HANDLES: Array<{ id: CropHandle; label: string; className: string }> = [
  { id: "nw", label: "Resize crop from top left", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
  { id: "n", label: "Resize crop from top", className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize" },
  { id: "ne", label: "Resize crop from top right", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
  { id: "e", label: "Resize crop from right", className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
  { id: "se", label: "Resize crop from bottom right", className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
  { id: "s", label: "Resize crop from bottom", className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize" },
  { id: "sw", label: "Resize crop from bottom left", className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
  { id: "w", label: "Resize crop from left", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
];

export function CropStage({
  previewUrl,
  imageWidth,
  imageHeight,
  crop,
  aspect,
  disabled,
  onChange,
}: CropStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragRef = useRef<{
    handle: CropHandle;
    startX: number;
    startY: number;
    region: CropRegion;
  } | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const update = () => {
      setContainerWidth(node.clientWidth);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const maxDisplayHeight = 480;
  const scale =
    containerWidth > 0 ? Math.min(containerWidth / imageWidth, maxDisplayHeight / imageHeight) : 0;
  const displayedWidth = Math.max(1, imageWidth * scale);
  const displayedHeight = Math.max(1, imageHeight * scale);
  const minEdge = uiMinCropEdge(imageWidth, imageHeight);

  const applyDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (!drag || scale <= 0) {
        return;
      }

      const dx = (clientX - drag.startX) / scale;
      const dy = (clientY - drag.startY) / scale;
      onChange(applyHandle(drag.region, drag.handle, dx, dy, { width: imageWidth, height: imageHeight }, aspect, minEdge));
    },
    [aspect, imageHeight, imageWidth, minEdge, onChange, scale]
  );

  function startDrag(handle: CropHandle, event: PointerEvent<HTMLElement>) {
    if (disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      handle,
      startX: event.clientX,
      startY: event.clientY,
      region: crop,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!dragRef.current) {
      return;
    }
    applyDrag(event.clientX, event.clientY);
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;
    let next: CropRegion | null = null;

    if (event.key === "ArrowLeft") {
      next = applyHandle(crop, "move", -step, 0, { width: imageWidth, height: imageHeight }, null, minEdge);
    } else if (event.key === "ArrowRight") {
      next = applyHandle(crop, "move", step, 0, { width: imageWidth, height: imageHeight }, null, minEdge);
    } else if (event.key === "ArrowUp") {
      next = applyHandle(crop, "move", 0, -step, { width: imageWidth, height: imageHeight }, null, minEdge);
    } else if (event.key === "ArrowDown") {
      next = applyHandle(crop, "move", 0, step, { width: imageWidth, height: imageHeight }, null, minEdge);
    }

    if (!next) {
      return;
    }

    event.preventDefault();
    onChange(next);
  }

  const left = crop.x * scale;
  const top = crop.y * scale;
  const width = crop.width * scale;
  const height = crop.height * scale;

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex justify-center overflow-hidden rounded-md bg-muted p-6">
        {scale > 0 ? (
          <div className="relative touch-none select-none" style={{ width: displayedWidth, height: displayedHeight }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Image to crop"
              draggable={false}
              width={displayedWidth}
              height={displayedHeight}
              className="pointer-events-none block h-full w-full max-w-none"
            />
            <div
              role="group"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Crop area ${formatDimensions(Math.round(crop.width), Math.round(crop.height))}. Use arrow keys to move.`}
              aria-disabled={disabled}
              onKeyDown={handleKeyDown}
              onPointerDown={(event) => startDrag("move", event)}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="absolute cursor-move border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.45)] outline-none focus-visible:border-primary"
              style={{ left, top, width, height }}
            >
              {HANDLES.map((handle) => (
                <button
                  key={handle.id}
                  type="button"
                  tabIndex={-1}
                  aria-label={handle.label}
                  disabled={disabled}
                  className={`absolute size-11 rounded-full disabled:opacity-50 ${handle.className}`}
                  onPointerDown={(event) => startDrag(handle.id, event)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  <span className="pointer-events-none absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white bg-foreground" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-52 w-full" aria-hidden="true" />
        )}
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Crop size {formatDimensions(Math.round(crop.width), Math.round(crop.height))}
      </p>
    </div>
  );
}
