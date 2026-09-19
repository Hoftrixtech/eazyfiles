export type PdfPageLayout = "image-size" | "a4-fit";

export const PDF_PAGE_LAYOUT_OPTIONS: readonly {
  id: PdfPageLayout;
  label: string;
  description: string;
}[] = [
  {
    id: "image-size",
    label: "Match image size",
    description: "Each PDF page uses the image dimensions (best for photos and screenshots).",
  },
  {
    id: "a4-fit",
    label: "Fit on A4",
    description: "Place each image on a standard A4 page with margins.",
  },
] as const;
