export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || value.includes("://")) {
    return "/";
  }

  return value;
}

/** Default landing page after sign-in when no explicit `next` path was provided. */
export function postAuthRedirectPath(value: unknown): string {
  const path = safeNextPath(value);
  return path === "/" ? "/account" : path;
}

export function withNextParam(pathname: "/login" | "/signup", next?: string): string {
  const path = safeNextPath(next);
  if (path === "/") {
    return pathname;
  }

  return `${pathname}?next=${encodeURIComponent(path)}`;
}
