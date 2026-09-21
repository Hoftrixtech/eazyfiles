"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LogoutMenuItem } from "@/components/account/LogoutMenuItem";
import { DASHBOARD_NAV } from "@/lib/dashboard/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) {
    return pathname === href;
  }
  if (href.includes("#")) {
    return pathname === href.split("#")[0];
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-border px-4 py-5 lg:px-5">
        <BrandLogo size="md" onClick={onNavigate} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4" aria-label="Dashboard">
        {DASHBOARD_NAV.map((group) => (
          <div key={group.id} className="mb-6 last:mb-0">
            <p className="mb-2 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href, item.exact);
                const Icon = item.icon;
                return (
                  <li key={`${group.id}-${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        item.comingSoon && "pointer-events-none opacity-60"
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3 lg:p-4">
        <LogoutMenuItem />
      </div>
    </div>
  );
}
