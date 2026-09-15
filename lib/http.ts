export function attachmentDisposition(filename: string): string {
  const safe = filename.replace(/[\r\n"]/g, "").replace(/[^\w.-]+/g, "_").slice(0, 100) || "image";
  return `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(safe)}`;
}
