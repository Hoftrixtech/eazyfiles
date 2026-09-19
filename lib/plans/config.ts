import type { ProcessingTool } from "@/types/access";

/** Launch access: logged-in users get all image tools free. Plans stay for a future monetization step. */
export const LAUNCH_ACCESS = {
  anonymousCompressorLimit: 5,
  /** Soft abuse ceiling for authenticated compressor (not a paid plan limit). */
  authenticatedCompressorDailyLimit: 50,
  loginRequiredTools: ["image-resizer", "image-cropper", "image-converter"] as const satisfies readonly ProcessingTool[],
} as const;

export type PlanId = "free" | "premium";

export function getPublicToolAccessCopy(
  slug: string,
  options?: { authenticated?: boolean }
): { tier: "FREE"; detail: string } | null {
  if (slug === "image-compressor") {
    return { tier: "FREE", detail: "Available" };
  }
  if (slug === "image-resizer" || slug === "image-cropper" || slug === "image-converter") {
    if (options?.authenticated) {
      return { tier: "FREE", detail: "Available" };
    }
    return { tier: "FREE", detail: "Login Required" };
  }
  return null;
}
