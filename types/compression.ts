export type SupportedImageFormat = "jpeg" | "png" | "webp";

export type OutputFormatOption = SupportedImageFormat | "original";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type ApiErrorCode =
  | "MISSING_FILE"
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE"
  | "INVALID_IMAGE"
  | "INVALID_TARGET"
  | "INVALID_REQUEST"
  | "ANIMATED_NOT_SUPPORTED"
  | "COMPRESSION_FAILED"
  | "INVALID_DIMENSIONS"
  | "RESIZE_FAILED"
  | "INVALID_CROP"
  | "CROP_FAILED"
  | "INVALID_OUTPUT_FORMAT"
  | "CONVERSION_FAILED"
  | "RATE_LIMITED"
  | "AUTH_REQUIRED"
  | "ANONYMOUS_LIMIT_REACHED"
  | "TRIAL_USED"
  | "PREMIUM_REQUIRED"
  | "DATABASE_UNAVAILABLE";

export interface TargetPreset {
  label: string;
  bytes: number;
}

export interface CompressionMeta {
  originalFileSize: number;
  compressedFileSize: number;
  originalFormat: SupportedImageFormat;
  outputFormat: SupportedImageFormat;
  targetSize: number;
  compressionPercentage: number;
  targetMet: boolean;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: ApiErrorCode | "UNKNOWN";
    message: string;
  };
}
