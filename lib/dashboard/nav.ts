import type { LucideIcon } from "lucide-react";
import {
  CircleHelp,
  Crop,
  ImageDown,
  LayoutDashboard,
  Repeat,
  Scaling,
  Settings,
  BarChart3,
  Timer,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  comingSoon?: boolean;
};

export type DashboardNavGroup = {
  id: string;
  label: string;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV: DashboardNavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [{ href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { href: "/", label: "Image Compressor", icon: ImageDown },
      { href: "/tools/image-resizer", label: "Image Resizer", icon: Scaling },
      { href: "/tools/image-cropper", label: "Image Cropper", icon: Crop },
      { href: "/tools/image-converter", label: "Image Converter", icon: Repeat },
    ],
  },
  {
    id: "activity",
    label: "Activity",
    items: [
      { href: "/account/activity", label: "Recent activity", icon: Timer },
      { href: "/account/activity#usage", label: "Usage overview", icon: BarChart3 },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [{ href: "/account/settings", label: "Profile & settings", icon: Settings }],
  },
  {
    id: "support",
    label: "Support",
    items: [{ href: "/account/help", label: "Help & support", icon: CircleHelp }],
  },
];
