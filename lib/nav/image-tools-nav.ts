import { getLiveTools, getPublicToolHref } from "@/lib/tools";
import type { ToolIconName } from "@/types/tools";

export type ImageToolNavItem = {
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: ToolIconName;
};

export function getImageToolsNavItems(): ImageToolNavItem[] {
  return getLiveTools()
    .filter((tool) => tool.category === "image-tools")
    .map((tool) => ({
      slug: tool.slug,
      name: tool.name,
      description: tool.shortDescription,
      href: getPublicToolHref(tool) ?? tool.route,
      icon: tool.icon,
    }));
}
