export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || value.includes("://")) {
    return "/";
  }

  return value;
}

export function withNextParam(pathname: "/login" | "/signup", next?: string): string {
  const path = safeNextPath(next);
  if (path === "/") {
    return pathname;
  }

  return `${pathname}?next=${encodeURIComponent(path)}`;
}
