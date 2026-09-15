import type { ApiErrorBody, ApiErrorCode } from "@/types/compression";

export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function errorJson(
  code: ApiErrorCode | "UNKNOWN",
  message: string,
  status: number,
  extraHeaders?: Record<string, string>
): Response {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message },
  };

  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
