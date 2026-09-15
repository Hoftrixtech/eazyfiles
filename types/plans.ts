/** Future-compatible plan types. Access at launch does not depend on these. */
export type PlanId = "free" | "premium";
export type SubscriptionStatus = "free" | "active" | "cancelled" | "expired";
export type BillingInterval = "month" | "year";
export type ToolAccessMode = "limited" | "trial" | "full";
export type PlanAdsMode = "future-public" | "none";

export interface PlanPrice {
  amount: number;
  currency: "USD";
  interval: BillingInterval;
}

export interface ToolAccessPolicy {
  access: ToolAccessMode;
  trialUses?: number;
}

export interface PlanUsageLimits {
  compressorAnonymous: number | null;
  compressorAuthenticatedDaily: number;
}

export type PlanToolId = "compress" | "image-resizer" | "image-cropper" | "image-converter";

export interface Plan {
  planId: PlanId;
  name: string;
  description: string;
  price: PlanPrice;
  billingInterval: BillingInterval;
  features: readonly string[];
  toolAccess: Record<PlanToolId, ToolAccessPolicy>;
  usageLimits: PlanUsageLimits;
  ads: PlanAdsMode;
}

export interface UserEntitlement {
  userId: string | null;
  planId: PlanId;
  status: SubscriptionStatus;
}

export interface EntitlementSummary {
  planId: PlanId;
  planName: string;
  status: SubscriptionStatus;
  premium: boolean;
}
