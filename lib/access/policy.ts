import "server-only";

import { getAnonymousCompressorCount } from "@/lib/access/anonymous-compress";
import { authenticatedUsageSubject, isPremiumImageTool } from "@/lib/access/tools";
import { LAUNCH_ACCESS } from "@/lib/plans/config";
import { getTodayCompressionCount } from "@/lib/usage";
import type { AccessIdentity, ProcessingTool } from "@/types/access";

export type AccessDenialReason = "anonymous-limit" | "auth-required" | "rate-limited";
export type AccessGrantReason = "anonymous" | "authenticated";

export interface CanUseToolResult {
  allowed: boolean;
  reason: AccessGrantReason | AccessDenialReason;
}

export async function canUseTool(tool: ProcessingTool, identity: AccessIdentity): Promise<CanUseToolResult> {
  if (tool === "compress") {
    if (!identity.userId) {
      const used = await getAnonymousCompressorCount(identity.sessionId);
      const allowed = used < LAUNCH_ACCESS.anonymousCompressorLimit;
      return { allowed, reason: allowed ? "anonymous" : "anonymous-limit" };
    }

    const used = await getTodayCompressionCount(authenticatedUsageSubject(identity.userId));
    const allowed = used < LAUNCH_ACCESS.authenticatedCompressorDailyLimit;
    return { allowed, reason: allowed ? "authenticated" : "rate-limited" };
  }

  if (!isPremiumImageTool(tool)) {
    return { allowed: false, reason: "auth-required" };
  }

  if (!identity.userId) {
    return { allowed: false, reason: "auth-required" };
  }

  return { allowed: true, reason: "authenticated" };
}

/** Launch model: subscriptions are not active. Always false. */
export function hasPremiumAccess(): boolean {
  return false;
}

export async function getUserEntitlement(userId: string | null | undefined) {
  return {
    userId: userId ?? null,
    planId: "free" as const,
    status: "free" as const,
  };
}
