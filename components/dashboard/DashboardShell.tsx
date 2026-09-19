"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";
import type { UserMenuUser } from "@/components/account/UserMenu";

export function DashboardShell({
  user,
  children,
}: {
  user: UserMenuUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[90rem]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[min(100%,17.5rem)] -translate-x-full border-r border-border bg-background pt-16 transition-transform duration-200 lg:static lg:z-auto lg:block lg:w-64 lg:shrink-0 lg:translate-x-0 lg:pt-0",
            mobileOpen && "translate-x-0"
          )}
          aria-hidden={!mobileOpen}
        >
          <DashboardSidebar onNavigate={() => setMobileOpen(false)} className="h-full" />
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader user={user} onOpenSidebar={() => setMobileOpen(true)} />
          <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
