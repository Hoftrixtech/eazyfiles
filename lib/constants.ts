import type { TargetPreset } from "@/types/compression";
import type { ConvertQualityOption } from "@/types/convert";
import type { CropAspectOption } from "@/types/crop";
import { LAUNCH_ACCESS } from "@/lib/plans/config";

export const APP_NAME = "EazyFiles";
export const APP_SHORT_NAME = "EazyFiles";
export const APP_TAGLINE = "Simple Tools. Powerful Results.";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Maximum images in one batch compress run (each image still uses one compression slot). */
export const MAX_COMPRESSOR_BATCH_FILES = 20;
export const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 1024 * 1024;
export const MIN_TARGET_BYTES = 10 * 1024;
export const MAX_TARGET_BYTES = 10 * 1024 * 1024;

export const TARGET_PRESETS: readonly TargetPreset[] = [
  { label: "50 KB", bytes: 50 * 1024 },
  { label: "100 KB", bytes: 100 * 1024 },
  { label: "200 KB", bytes: 200 * 1024 },
  { label: "500 KB", bytes: 500 * 1024 },
  { label: "1 MB", bytes: 1024 * 1024 },
] as const;

export const DEFAULT_TARGET_BYTES = 100 * 1024;

export const DAILY_COMPRESSION_LIMIT = LAUNCH_ACCESS.authenticatedCompressorDailyLimit;
export const ANONYMOUS_COMPRESSOR_LIMIT = LAUNCH_ACCESS.anonymousCompressorLimit;
export const LOGIN_MAX_FAILURES = 8;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 8;
export const SESSION_COOKIE_NAME = "eis_session";
export const SESSION_HEADER_NAME = "x-session-id";
export const SESSION_STORAGE_KEY = "eis_session";

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const SUPPORTED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export const ACCEPTED_FILE_INPUT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const MIN_RESIZE_EDGE = 1;
export const MAX_RESIZE_EDGE = 8192;
export const MAX_RESIZE_PIXELS = 40_000_000;

export const MIN_CROP_EDGE = 1;
export const MIN_CROP_UI_EDGE = 16;

export const CROP_ASPECT_OPTIONS: readonly CropAspectOption[] = [
  { id: "free", label: "Free", value: null },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:2", label: "3:2", value: 3 / 2 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
] as const;

export const DEFAULT_CONVERT_QUALITY = "high" as const;

export const CONVERT_QUALITY_OPTIONS: readonly ConvertQualityOption[] = [
  { id: "high", label: "High", description: "Best visual quality" },
  { id: "balanced", label: "Balanced", description: "Good quality, smaller file" },
  { id: "smaller", label: "Smaller File", description: "More compression" },
] as const;

export const RESIZE_PERCENT_PRESETS = [25, 50, 75, 100] as const;

export const RESIZE_DIMENSION_PRESETS: readonly { label: string; width: number; height: number }[] = [
  { label: "1920 × 1080", width: 1920, height: 1080 },
  { label: "1280 × 720", width: 1280, height: 720 },
  { label: "1080 × 1080", width: 1080, height: 1080 },
  { label: "1080 × 1350", width: 1080, height: 1350 },
  { label: "1080 × 1920", width: 1080, height: 1920 },
  { label: "800 × 600", width: 800, height: 600 },
] as const;

export const FUTURE_SEO_PATHS = [
  "/compress-image",
  "/compress-jpg",
  "/compress-png",
  "/compress-webp",
  "/compress-image-to-100kb",
  "/compress-image-to-200kb",
  "/compress-image-to-500kb",
] as const;
