import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS, MIN_RESIZE_EDGE } from "@/lib/constants";

export interface PixelSize {
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampResizeEdge(value: number): number {
  return clamp(Math.round(value), MIN_RESIZE_EDGE, MAX_RESIZE_EDGE);
}

export function resizePixelCount(width: number, height: number): number {
  return width * height;
}

export function isAllowedResizeSize(width: number, height: number): boolean {
  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width >= MIN_RESIZE_EDGE &&
    height >= MIN_RESIZE_EDGE &&
    width <= MAX_RESIZE_EDGE &&
    height <= MAX_RESIZE_EDGE &&
    resizePixelCount(width, height) <= MAX_RESIZE_PIXELS
  );
}

export function sizeFromPercent(original: PixelSize, percent: number): PixelSize {
  const scale = percent / 100;
  return {
    width: clampResizeEdge(original.width * scale),
    height: clampResizeEdge(original.height * scale),
  };
}

export function sizeFromWidth(original: PixelSize, width: number): PixelSize {
  const nextWidth = clampResizeEdge(width);
  const ratio = original.width > 0 ? original.height / original.width : 1;
  return {
    width: nextWidth,
    height: clampResizeEdge(nextWidth * ratio),
  };
}

export function sizeFromHeight(original: PixelSize, height: number): PixelSize {
  const nextHeight = clampResizeEdge(height);
  const ratio = original.height > 0 ? original.width / original.height : 1;
  return {
    width: clampResizeEdge(nextHeight * ratio),
    height: nextHeight,
  };
}

export function fitInside(original: PixelSize, box: PixelSize): PixelSize {
  const scale = Math.min(box.width / original.width, box.height / original.height, 1_000);
  return {
    width: clampResizeEdge(original.width * scale),
    height: clampResizeEdge(original.height * scale),
  };
}
