"use client";

import dynamic from "next/dynamic";
import { ImageCompressorSkeleton } from "@/components/compressor/ImageCompressorSkeleton";

const ImageCompressor = dynamic(
  () => import("@/components/compressor/ImageCompressor").then((mod) => ({ default: mod.ImageCompressor })),
  { loading: () => <ImageCompressorSkeleton /> },
);

export function HomeImageCompressor() {
  return <ImageCompressor />;
}
