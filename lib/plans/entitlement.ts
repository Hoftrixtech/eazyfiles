import type { EntitlementSummary, PlanId, UserEntitlement } from "@/types/plans";

/** Future-compatible helpers. Launch access does not use premium entitlements. */
export const FREE_ENTITLEMENT: UserEntitlement = {
  userId: null,
  planId: "free",
  status: "free",
};

export function hasPremiumAccess(_entitlement?: UserEntitlement | EntitlementSummary | null): boolean {
  void _entitlement;
  return false;
}

export function toEntitlementSummary(entitlement: UserEntitlement): EntitlementSummary {
  return {
    planId: "free",
    planName: "Free",
    status: entitlement.status === "free" ? "free" : entitlement.status,
    premium: false,
  };
}

export function resolveEffectivePlanId(_entitlement?: UserEntitlement | EntitlementSummary | null): PlanId {
  void _entitlement;
  return "free";
}
