import "server-only";

import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import type { PdfPageLayout } from "@/types/pdf";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const A4_MARGIN = 36;
const MAX_PAGE_DIMENSION = 14_400;

interface PreparedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
  embed: "jpg" | "png";
}

async function prepareImage(buffer: Buffer): Promise<PreparedImage> {
  const pipeline = sharp(buffer).rotate();
  const meta = await pipeline.metadata();
  const width = meta.width ?? 1;
  const height = meta.height ?? 1;

  if (meta.hasAlpha) {
    const png = await pipeline.png().toBuffer();
    return { bytes: new Uint8Array(png), width, height, embed: "png" };
  }

  const jpeg = await pipeline.jpeg({ quality: 92 }).toBuffer();
  return { bytes: new Uint8Array(jpeg), width, height, embed: "jpg" };
}

function scaleDimensions(width: number, height: number): { width: number; height: number } {
  const max = Math.max(width, height);
  if (max <= MAX_PAGE_DIMENSION) {
    return { width, height };
  }
  const scale = MAX_PAGE_DIMENSION / max;
  return { width: width * scale, height: height * scale };
}

export interface ImagesToPdfResult {
  pdfBytes: Uint8Array;
  pageCount: number;
  totalInputBytes: number;
}

export async function imagesToPdf(images: Buffer[], layout: PdfPageLayout): Promise<ImagesToPdfResult> {
  if (images.length === 0) {
    throw new Error("At least one image is required.");
  }

  const pdfDoc = await PDFDocument.create();
  let totalInputBytes = 0;

  for (const buffer of images) {
    totalInputBytes += buffer.byteLength;
    const prepared = await prepareImage(buffer);
    const embedded =
      prepared.embed === "png" ? await pdfDoc.embedPng(prepared.bytes) : await pdfDoc.embedJpg(prepared.bytes);

    const naturalW = embedded.width;
    const naturalH = embedded.height;
    const { width: pageW, height: pageH } = scaleDimensions(naturalW, naturalH);

    if (layout === "image-size") {
      const page = pdfDoc.addPage([pageW, pageH]);
      page.drawImage(embedded, { x: 0, y: 0, width: pageW, height: pageH });
      continue;
    }

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    const innerW = A4_WIDTH - A4_MARGIN * 2;
    const innerH = A4_HEIGHT - A4_MARGIN * 2;
    const scale = Math.min(innerW / naturalW, innerH / naturalH);
    const drawW = naturalW * scale;
    const drawH = naturalH * scale;
    page.drawImage(embedded, {
      x: A4_MARGIN + (innerW - drawW) / 2,
      y: A4_MARGIN + (innerH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, pageCount: images.length, totalInputBytes };
}
