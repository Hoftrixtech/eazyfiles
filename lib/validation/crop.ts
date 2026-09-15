import { z } from "zod";
import { MAX_RESIZE_EDGE, MAX_RESIZE_PIXELS, MIN_CROP_EDGE } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { isAllowedResizeSize } from "@/lib/resize/dimensions";

const cropEdgeSchema = (label: string, minimum: number) =>
  z
    .string()
    .regex(/^\d+$/, `${label} must be a whole number of pixels.`)
    .transform((value) => Number.parseInt(value, 10))
    .pipe(
      z
        .number()
        .int()
        .min(minimum, `${label} must be at least ${minimum} pixel${minimum === 1 ? "" : "s"}.`)
        .max(MAX_RESIZE_EDGE, `${label} cannot be more than ${MAX_RESIZE_EDGE} pixels.`)
    );

export const cropFieldsSchema = z.object({
  x: cropEdgeSchema("Crop X", 0),
  y: cropEdgeSchema("Crop Y", 0),
  width: cropEdgeSchema("Crop width", MIN_CROP_EDGE),
  height: cropEdgeSchema("Crop height", MIN_CROP_EDGE),
  outputFormat: z.enum(["original", "jpeg", "png", "webp"]).optional().default("original"),
});

export type CropFields = z.infer<typeof cropFieldsSchema>;

export function parseCropFields(raw: {
  x: FormDataEntryValue | null;
  y: FormDataEntryValue | null;
  width: FormDataEntryValue | null;
  height: FormDataEntryValue | null;
  outputFormat: FormDataEntryValue | null;
}): CropFields {
  const parsed = cropFieldsSchema.safeParse({
    x: typeof raw.x === "string" ? raw.x : "",
    y: typeof raw.y === "string" ? raw.y : "",
    width: typeof raw.width === "string" ? raw.width : "",
    height: typeof raw.height === "string" ? raw.height : "",
    outputFormat:
      typeof raw.outputFormat === "string" && raw.outputFormat.length > 0 ? raw.outputFormat : "original",
  });

  if (!parsed.success) {
    throw new AppError(
      "INVALID_CROP",
      parsed.error.issues[0]?.message ?? "Enter a valid crop area.",
      400
    );
  }

  if (!isAllowedResizeSize(parsed.data.width, parsed.data.height)) {
    throw new AppError(
      "INVALID_CROP",
      `The crop size is too large. Stay within ${MAX_RESIZE_EDGE}px on each side and ${MAX_RESIZE_PIXELS.toLocaleString()} pixels total.`,
      400
    );
  }

  return parsed.data;
}
