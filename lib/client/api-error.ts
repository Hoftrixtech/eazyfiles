import type { ApiErrorBody } from "@/types/compression";

export class ApiRequestError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
  }
}

export function throwFromApiPayload(payload: unknown, fallback: string): never {
  const error = payload && typeof payload === "object" && "error" in payload ? (payload as ApiErrorBody).error : null;
  const code = typeof error?.code === "string" && error.code.length > 0 ? error.code : "UNKNOWN";
  const message = typeof error?.message === "string" && error.message.length > 0 ? error.message : fallback;
  throw new ApiRequestError(code, message);
}

