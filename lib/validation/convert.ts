import { z } from "zod";
import { AppError } from "@/lib/errors";
import type { ConvertQuality } from "@/types/convert";

export const convertFieldsSchema = z.object({
  outputFormat: z.enum(["jpeg", "png", "webp"], {
    error: "Choose JPG, PNG or WebP as the output format.",
  }),
  quality: z.enum(["high", "balanced", "smaller"]).optional().default("high"),
});

export type ConvertFields = z.infer<typeof convertFieldsSchema>;

export function parseConvertFields(raw: {
  outputFormat: FormDataEntryValue | null;
  quality: FormDataEntryValue | null;
}): ConvertFields {
  const parsed = convertFieldsSchema.safeParse({
    outputFormat: typeof raw.outputFormat === "string" ? raw.outputFormat : "",
    quality: typeof raw.quality === "string" && raw.quality.length > 0 ? raw.quality : "high",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "The conversion settings are invalid.";
    const isFormatIssue = parsed.error.issues.some((issue) => issue.path[0] === "outputFormat");
    throw new AppError(
      isFormatIssue ? "INVALID_OUTPUT_FORMAT" : "INVALID_REQUEST",
      message,
      400
    );
  }

  return parsed.data;
}

export function isConvertQuality(value: string): value is ConvertQuality {
  return value === "high" || value === "balanced" || value === "smaller";
}
