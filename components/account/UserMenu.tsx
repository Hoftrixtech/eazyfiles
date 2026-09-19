"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Settings, Wrench } from "lucide-react";
import { LogoutMenuItem } from "@/components/account/LogoutMenuItem";
import { UserAvatar } from "@/components/account/UserAvatar";
import { cn } from "@/lib/utils";

export type UserMenuUser = {
  name: string;
  email: string;
};

const menuLinkClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted";

export function UserMenu({
  user,
  triggerClassName,
}: {
  user: UserMenuUser;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          triggerClassName
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
      >
        <UserAvatar name={user.name} size="sm" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-elevated)]"
        >
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-3">
            <UserAvatar name={user.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-1 space-y-0.5 border-t border-border pt-1">
            <Link href="/account" role="menuitem" className={menuLinkClass} onClick={() => setOpen(false)}>
              <LayoutDashboard className="size-4 text-muted-foreground" aria-hidden="true" />
              Dashboard
            </Link>
            <Link
              href="/account/settings"
              role="menuitem"
              className={menuLinkClass}
              onClick={() => setOpen(false)}
            >
              <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
              Account settings
            </Link>
            <Link href="/tools" role="menuitem" className={menuLinkClass} onClick={() => setOpen(false)}>
              <Wrench className="size-4 text-muted-foreground" aria-hidden="true" />
              Browse tools
            </Link>
          </div>

          <div className="mt-1 border-t border-border pt-1">
            <LogoutMenuItem />
          </div>
        </div>
      ) : null}
    </div>
  );
}
