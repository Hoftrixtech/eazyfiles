import "server-only";

import { FREE_ENTITLEMENT } from "@/lib/plans/entitlement";
import type { UserEntitlement } from "@/types/plans";

/** Launch model: always free. Entitlement records are ignored for access. */
export async function getUserEntitlement(userId: string | null | undefined): Promise<UserEntitlement> {
  if (!userId) {
    return FREE_ENTITLEMENT;
  }
  return {
    userId,
    planId: "free",
    status: "free",
  };
}

export { hasPremiumAccess, toEntitlementSummary } from "@/lib/plans/entitlement";
