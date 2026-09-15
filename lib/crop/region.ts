import { CROP_ASPECT_OPTIONS, MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS, MIN_CROP_EDGE, MIN_CROP_UI_EDGE } from "@/lib/constants";
import type { CropAspectId, CropHandle, CropRegion } from "@/types/crop";

export function roundRegion(region: CropRegion): CropRegion {
  return {
    x: Math.round(region.x),
    y: Math.round(region.y),
    width: Math.round(region.width),
    height: Math.round(region.height),
  };
}

export function uiMinCropEdge(imageWidth: number, imageHeight: number): number {
  return Math.max(MIN_CROP_EDGE, Math.min(MIN_CROP_UI_EDGE, imageWidth, imageHeight));
}

export function getAspectValue(id: CropAspectId): number | null {
  return CROP_ASPECT_OPTIONS.find((option) => option.id === id)?.value ?? null;
}

export function isValidCropRegion(region: CropRegion, imageWidth: number, imageHeight: number): boolean {
  const { x, y, width, height } = roundRegion(region);

  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    x >= 0 &&
    y >= 0 &&
    width >= MIN_CROP_EDGE &&
    height >= MIN_CROP_EDGE &&
    width <= MAX_RESIZE_EDGE &&
    height <= MAX_RESIZE_EDGE &&
    x + width <= imageWidth &&
    y + height <= imageHeight &&
    width * height <= MAX_RESIZE_PIXELS
  );
}

export function clampCropRegion(
  region: CropRegion,
  imageWidth: number,
  imageHeight: number,
  aspect: number | null = null,
  minEdge = MIN_CROP_EDGE
): CropRegion {
  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight) || imageWidth < 1 || imageHeight < 1) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const minW = Math.min(Math.max(MIN_CROP_EDGE, minEdge), imageWidth);
  const minH = Math.min(Math.max(MIN_CROP_EDGE, minEdge), imageHeight);
  const maxW = Math.min(imageWidth, MAX_RESIZE_EDGE);
  const maxH = Math.min(imageHeight, MAX_RESIZE_EDGE);

  let width = Math.round(region.width);
  let height = Math.round(region.height);
  let x = Math.round(region.x);
  let y = Math.round(region.y);

  width = Math.min(maxW, Math.max(minW, width));
  height = Math.min(maxH, Math.max(minH, height));

  if (aspect && aspect > 0) {
    let nextWidth = width;
    let nextHeight = Math.round(nextWidth / aspect);

    if (nextHeight > maxH || nextHeight < minH) {
      nextHeight = Math.min(maxH, Math.max(minH, nextHeight));
      nextWidth = Math.round(nextHeight * aspect);
    }

    if (nextWidth > maxW || nextWidth < minW) {
      nextWidth = Math.min(maxW, Math.max(minW, nextWidth));
      nextHeight = Math.round(nextWidth / aspect);
      nextHeight = Math.min(maxH, Math.max(minH, nextHeight));
    }

    width = nextWidth;
    height = nextHeight;
  }

  if (width * height > MAX_RESIZE_PIXELS) {
    const scale = Math.sqrt(MAX_RESIZE_PIXELS / (width * height));
    width = Math.max(minW, Math.floor(width * scale));
    height = Math.max(minH, Math.floor(height * scale));
  }

  width = Math.min(maxW, Math.max(minW, width));
  height = Math.min(maxH, Math.max(minH, height));

  x = Math.min(Math.max(0, x), imageWidth - width);
  y = Math.min(Math.max(0, y), imageHeight - height);

  return { x, y, width, height };
}

export function defaultCropRegion(
  imageWidth: number,
  imageHeight: number,
  aspect: number | null = null,
  minEdge = MIN_CROP_EDGE
): CropRegion {
  if (aspect && aspect > 0) {
    let width = imageWidth;
    let height = width / aspect;

    if (height > imageHeight) {
      height = imageHeight;
      width = height * aspect;
    }

    return clampCropRegion(
      {
        x: (imageWidth - width) / 2,
        y: (imageHeight - height) / 2,
        width,
        height,
      },
      imageWidth,
      imageHeight,
      aspect,
      minEdge
    );
  }

  const width = Math.max(minEdge, Math.round(imageWidth * 0.8));
  const height = Math.max(minEdge, Math.round(imageHeight * 0.8));

  return clampCropRegion(
    {
      x: (imageWidth - width) / 2,
      y: (imageHeight - height) / 2,
      width,
      height,
    },
    imageWidth,
    imageHeight,
    null,
    minEdge
  );
}

export function applyHandle(
  region: CropRegion,
  handle: CropHandle,
  dx: number,
  dy: number,
  image: { width: number; height: number },
  aspect: number | null,
  minEdge = MIN_CROP_EDGE
): CropRegion {
  if (handle === "move") {
    return clampCropRegion(
      {
        x: region.x + dx,
        y: region.y + dy,
        width: region.width,
        height: region.height,
      },
      image.width,
      image.height,
      null,
      minEdge
    );
  }

  const right = region.x + region.width;
  const bottom = region.y + region.height;
  let x = region.x;
  let y = region.y;
  let width = region.width;
  let height = region.height;

  switch (handle) {
    case "e":
      width = region.width + dx;
      break;
    case "w":
      x = region.x + dx;
      width = region.width - dx;
      break;
    case "s":
      height = region.height + dy;
      break;
    case "n":
      y = region.y + dy;
      height = region.height - dy;
      break;
    case "se":
      width = region.width + dx;
      height = region.height + dy;
      break;
    case "sw":
      x = region.x + dx;
      width = region.width - dx;
      height = region.height + dy;
      break;
    case "ne":
      width = region.width + dx;
      y = region.y + dy;
      height = region.height - dy;
      break;
    case "nw":
      x = region.x + dx;
      width = region.width - dx;
      y = region.y + dy;
      height = region.height - dy;
      break;
  }

  if (aspect && aspect > 0) {
    const verticalOnly = handle === "n" || handle === "s";

    if (verticalOnly) {
      width = height * aspect;
      x = region.x + region.width / 2 - width / 2;
      if (handle === "n") {
        y = bottom - height;
      }
    } else {
      height = width / aspect;
      if (handle === "ne" || handle === "nw") {
        y = bottom - height;
      }
      if (handle === "w" || handle === "sw" || handle === "nw") {
        x = right - width;
      }
    }
  }

  return clampCropRegion({ x, y, width, height }, image.width, image.height, aspect, minEdge);
}
