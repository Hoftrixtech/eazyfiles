import type { PdfPageLayout } from "@/types/pdf";

export function parsePdfPageLayout(value: FormDataEntryValue | null): PdfPageLayout {
  if (typeof value === "string" && value === "a4-fit") {
    return "a4-fit";
  }
  return "image-size";
}
