import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Calculator,
  Code,
  Crop,
  FileDown,
  FileText,
  Files,
  ImageDown,
  Images,
  Percent,
  QrCode,
  Repeat,
  Scaling,
  Sparkles,
  Type,
} from "lucide-react";
import type { ToolIconName } from "@/types/tools";

const TOOL_ICONS: Record<ToolIconName, LucideIcon> = {
  "image-down": ImageDown,
  scaling: Scaling,
  crop: Crop,
  repeat: Repeat,
  images: Images,
  "file-down": FileDown,
  files: Files,
  "file-text": FileText,
  type: Type,
  braces: Braces,
  percent: Percent,
  calculator: Calculator,
  code: Code,
  "qr-code": QrCode,
  sparkles: Sparkles,
};

export function ToolIcon({ name, className }: { name: ToolIconName; className?: string }) {
  return createElement(TOOL_ICONS[name], { className, "aria-hidden": true });
}
