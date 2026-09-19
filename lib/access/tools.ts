import type { PremiumImageTool } from "@/types/access";

export const PREMIUM_IMAGE_TOOLS = ["image-resizer", "image-cropper", "image-converter", "image-to-pdf"] as const;

export function isPremiumImageTool(value: string): value is PremiumImageTool {
  return (PREMIUM_IMAGE_TOOLS as readonly string[]).includes(value);
}

export function authenticatedUsageSubject(userId: string): string {
  return `user:${userId}`;
}
