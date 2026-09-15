export type CropAspectId = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "9:16";

export type CropHandle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropAspectOption {
  id: CropAspectId;
  label: string;
  value: number | null;
}
