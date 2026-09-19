"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ToolIcon } from "@/lib/tools/icons";
import type { ImageToolNavItem } from "@/lib/nav/image-tools-nav";
import { cn } from "@/lib/utils";

const triggerClass =
  "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground";

const CLOSE_DELAY_MS = 150;

export function SiteHeaderImageToolsMenu({ items }: { items: ImageToolNavItem[] }) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const showMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={cn(triggerClass, open && "bg-foreground/5 text-foreground")}
        aria-haspopup="true"
        aria-expanded={open}
        id="tools-menu-button"
        onMouseEnter={showMenu}
        onMouseLeave={scheduleClose}
        onFocus={showMenu}
      >
        Tools
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 transition-[opacity,transform]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
        role="menu"
        aria-labelledby="tools-menu-button"
        onMouseEnter={showMenu}
        onMouseLeave={scheduleClose}
      >
        <div className="h-2 w-full" aria-hidden="true" />
        <div className="w-full border-b border-border bg-card shadow-[var(--shadow-elevated)]">
          <Container className="max-w-[90rem] py-5 sm:py-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Free online tools</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {items.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={tool.href}
                    role="menuitem"
                    className="flex h-full gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onFocus={showMenu}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ToolIcon name={tool.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{tool.name}</span>
                      <span className="mt-1 block text-xs leading-snug text-muted-foreground line-clamp-3">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
              <Link href="/tools?category=image-tools" className="brand-text-link font-medium">
                All image tools →
              </Link>
              <Link href="/tools" className="text-muted-foreground transition-colors hover:text-foreground">
                Full tools catalog
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}
