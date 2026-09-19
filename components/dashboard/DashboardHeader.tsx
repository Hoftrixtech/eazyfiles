"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { UserMenu } from "@/components/account/UserMenu";
import { Button } from "@/components/ui/Button";
import type { UserMenuUser } from "@/components/account/UserMenu";

const PAGE_META: Record<string, { title: string; section: string }> = {
  "/account": { title: "Dashboard", section: "My account" },
  "/account/settings": { title: "Profile & settings", section: "Account" },
  "/account/activity": { title: "Activity", section: "Usage & history" },
  "/account/help": { title: "Help & support", section: "Support" },
};

function resolvePageMeta(pathname: string) {
  return PAGE_META[pathname] ?? { title: "Account", section: "My account" };
}

export function DashboardHeader({
  user,
  onOpenSidebar,
}: {
  user: UserMenuUser;
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const meta = resolvePageMeta(pathname);
  const displayName = user.name.trim() || user.email;

  return (
    <header className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-0.5 shrink-0 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open menu"
          >
            <Menu className="size-4" aria-hidden="true" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{meta.section}</p>
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{meta.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href="/tools?category=image-tools"
            className="hidden h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex sm:max-w-xs lg:max-w-sm"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Quick access to tools</span>
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="max-w-[10rem] truncate text-sm font-medium text-foreground">{displayName}</span>
          </div>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
