import "server-only";

/** Remove control characters and header-breaking newlines from user-provided text. */
export function sanitizeContactField(value: string, maxLength: number): string {
  const withoutControls = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const singleLine = withoutControls.replace(/[\r\n]+/g, " ");
  return singleLine.trim().slice(0, maxLength);
}

export function sanitizeContactMessage(value: string, maxLength: number): string {
  const withoutControls = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const normalized = withoutControls.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return normalized.trim().slice(0, maxLength);
}
