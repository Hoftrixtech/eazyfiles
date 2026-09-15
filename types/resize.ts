export interface ResizeDimensionPreset {
  label: string;
  width: number;
  height: number;
}

export interface ResizeResultMeta {
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  originalBytes: number;
  outputBytes: number;
  outputFormat: "jpeg" | "png" | "webp";
  sizeDeltaPercent: number;
}
