"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, Settings } from "lucide-react";
import { LogoutMenuItem } from "@/components/account/LogoutMenuItem";
import type { UserMenuUser } from "@/components/account/UserMenu";
import { brandCtaClass, brandOutlineCtaClass } from "@/lib/brand-styles";
import type { ImageToolNavItem } from "@/lib/nav/image-tools-nav";
import { ToolIcon } from "@/lib/tools/icons";

const linkClass =
  "rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted";

export function SiteHeaderMobileMenu({
  links,
  imageTools,
  user,
}: {
  links: readonly { href: string; label: string }[];
  imageTools: ImageToolNavItem[];
  user: UserMenuUser | null;
}) {
  return (
    <details className="group relative md:hidden">
      <summary
        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 16 16" className="size-4 group-open:hidden" aria-hidden="true">
          <path
            d="M2.5 4.25h11M2.5 8h11M2.5 11.75h11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <svg viewBox="0 0 16 16" className="hidden size-4 group-open:block" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 top-16 z-[70] flex max-h-[calc(100vh-4rem)] w-full flex-col gap-1 overflow-y-auto border-b border-border bg-card px-4 py-3 shadow-[var(--shadow-elevated)] sm:px-6"
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ))}
        <details className="group/tools px-1">
          <summary className={`${linkClass} cursor-pointer list-none font-medium`}>Tools</summary>
          <div className="mt-1 ml-2 space-y-0.5 border-l border-border pl-2">
            {imageTools.map((tool) => (
              <Link key={tool.slug} href={tool.href} className={`${linkClass} flex items-center gap-2 py-2`}>
                <ToolIcon name={tool.icon} className="size-4 shrink-0 text-primary" />
                <span>{tool.name}</span>
              </Link>
            ))}
            <Link href="/tools?category=image-tools" className={`${linkClass} text-primary`}>
              All image tools →
            </Link>
          </div>
        </details>
        <div className="my-1 space-y-0.5 border-t border-border pt-1">
          {user ? (
            <>
              <p className="truncate px-3 py-1.5 text-xs text-muted-foreground">{user.email}</p>
              <Link href="/account" className={`${linkClass} flex items-center gap-2`}>
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Link>
              <Link href="/account/settings" className={`${linkClass} flex items-center gap-2`}>
                <Settings className="size-4" aria-hidden="true" />
                Settings
              </Link>
              <LogoutMenuItem />
            </>
          ) : (
            <>
              <Link href="/login" className={`${brandOutlineCtaClass} mt-1 h-11 w-full`}>
                Log In
              </Link>
              <Link
                href="/signup"
                className={`${brandCtaClass} mt-1 h-11 w-full`}
              >
                Sign Up
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </details>
  );
}
