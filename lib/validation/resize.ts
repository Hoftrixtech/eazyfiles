import { z } from "zod";
import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS, MIN_RESIZE_EDGE } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { isAllowedResizeSize } from "@/lib/resize/dimensions";

export const resizeFieldsSchema = z.object({
  width: z
    .string()
    .regex(/^\d+$/, "Width must be a whole number of pixels.")
    .transform((value) => Number.parseInt(value, 10))
    .pipe(
      z
        .number()
        .int()
        .min(MIN_RESIZE_EDGE, `Width must be at least ${MIN_RESIZE_EDGE} pixel.`)
        .max(MAX_RESIZE_EDGE, `Width cannot be more than ${MAX_RESIZE_EDGE} pixels.`)
    ),
  height: z
    .string()
    .regex(/^\d+$/, "Height must be a whole number of pixels.")
    .transform((value) => Number.parseInt(value, 10))
    .pipe(
      z
        .number()
        .int()
        .min(MIN_RESIZE_EDGE, `Height must be at least ${MIN_RESIZE_EDGE} pixel.`)
        .max(MAX_RESIZE_EDGE, `Height cannot be more than ${MAX_RESIZE_EDGE} pixels.`)
    ),
  outputFormat: z.enum(["original", "jpeg", "png", "webp"]).optional().default("original"),
});

export type ResizeFields = z.infer<typeof resizeFieldsSchema>;

export function parseResizeFields(raw: {
  width: FormDataEntryValue | null;
  height: FormDataEntryValue | null;
  outputFormat: FormDataEntryValue | null;
}): ResizeFields {
  const parsed = resizeFieldsSchema.safeParse({
    width: typeof raw.width === "string" ? raw.width : "",
    height: typeof raw.height === "string" ? raw.height : "",
    outputFormat:
      typeof raw.outputFormat === "string" && raw.outputFormat.length > 0 ? raw.outputFormat : "original",
  });

  if (!parsed.success) {
    throw new AppError(
      "INVALID_DIMENSIONS",
      parsed.error.issues[0]?.message ?? "Enter a valid width and height.",
      400
    );
  }

  if (!isAllowedResizeSize(parsed.data.width, parsed.data.height)) {
    throw new AppError(
      "INVALID_DIMENSIONS",
      `The requested size is too large. Stay within ${MAX_RESIZE_EDGE}px on each side and ${MAX_RESIZE_PIXELS.toLocaleString()} pixels total.`,
      400
    );
  }

  return parsed.data;
}
