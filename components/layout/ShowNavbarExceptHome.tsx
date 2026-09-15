"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ShowNavbarExceptHome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return children;
}
