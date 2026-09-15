import "server-only";

import { getAnonymousCompressorCount } from "@/lib/access/anonymous-compress";
import { getSessionUser } from "@/lib/access/identity";
import { authenticatedUsageSubject, PREMIUM_IMAGE_TOOLS } from "@/lib/access/tools";
import { LAUNCH_ACCESS } from "@/lib/plans/config";
import { getTodayCompressionCount } from "@/lib/usage";
import type { AccessIdentity, AccessStatus, PremiumImageTool, ToolGateState } from "@/types/access";
import type { EntitlementSummary } from "@/types/plans";

const FREE_ENTITLEMENT_SUMMARY: EntitlementSummary = {
  planId: "free",
  planName: "Free",
  status: "free",
  premium: false,
};

function toolGates(authenticated: boolean): Record<PremiumImageTool, ToolGateState> {
  const state: ToolGateState = authenticated ? "free" : "auth-required";
  return Object.fromEntries(PREMIUM_IMAGE_TOOLS.map((tool) => [tool, state])) as Record<
    PremiumImageTool,
    ToolGateState
  >;
}

function legacyTrials(
  authenticated: boolean
): AccessStatus["trials"] {
  const state = authenticated ? "available" : "auth-required";
  return Object.fromEntries(PREMIUM_IMAGE_TOOLS.map((tool) => [tool, state])) as AccessStatus["trials"];
}

export async function getSessionScopedAccessStatus(identity: AccessIdentity): Promise<AccessStatus> {
  const sessionUser = identity.userId ? await getSessionUser() : null;
  const authenticated = Boolean(identity.userId);

  if (!authenticated) {
    const limit = LAUNCH_ACCESS.anonymousCompressorLimit;
    return {
      authenticated: false,
      user: null,
      compressor: {
        mode: "anonymous",
        used: 0,
        limit,
        remaining: limit,
        allowed: true,
      },
      tools: toolGates(false),
      trials: legacyTrials(false),
      entitlement: FREE_ENTITLEMENT_SUMMARY,
    };
  }

  return {
    authenticated: true,
    user: sessionUser && sessionUser.id === identity.userId ? sessionUser : null,
    compressor: {
      mode: "authenticated",
      used: 0,
      limit: LAUNCH_ACCESS.authenticatedCompressorDailyLimit,
      remaining: LAUNCH_ACCESS.authenticatedCompressorDailyLimit,
      allowed: true,
    },
    tools: toolGates(true),
    trials: legacyTrials(true),
    entitlement: FREE_ENTITLEMENT_SUMMARY,
  };
}

export async function getAccessStatus(identity: AccessIdentity): Promise<AccessStatus> {
  if (!identity.userId) {
    const limit = LAUNCH_ACCESS.anonymousCompressorLimit;
    const used = await getAnonymousCompressorCount(identity.sessionId);
    const remaining = Math.max(0, limit - used);

    return {
      authenticated: false,
      user: null,
      compressor: {
        mode: "anonymous",
        used,
        limit,
        remaining,
        allowed: remaining > 0,
      },
      tools: toolGates(false),
      trials: legacyTrials(false),
      entitlement: FREE_ENTITLEMENT_SUMMARY,
    };
  }

  const usedToday = await getTodayCompressionCount(authenticatedUsageSubject(identity.userId));
  const limit = LAUNCH_ACCESS.authenticatedCompressorDailyLimit;
  const remaining = Math.max(0, limit - usedToday);
  const user = await getSessionUser();

  return {
    authenticated: true,
    user: user && user.id === identity.userId ? user : null,
    compressor: {
      mode: "authenticated",
      used: usedToday,
      limit,
      remaining,
      allowed: remaining > 0,
    },
    tools: toolGates(true),
    trials: legacyTrials(true),
    entitlement: FREE_ENTITLEMENT_SUMMARY,
  };
}
