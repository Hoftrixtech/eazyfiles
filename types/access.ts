import type { EntitlementSummary } from "@/types/plans";

export type PremiumImageTool = "image-resizer" | "image-cropper" | "image-converter" | "image-to-pdf";

export type ProcessingTool = "compress" | PremiumImageTool;

/** auth-required for anonymous; free for logged-in users (launch model). */
export type ToolGateState = "auth-required" | "free";

export type AccessReservation =
  | { kind: "anonymous-compress"; sessionId: string }
  | { kind: "authenticated-compress"; subjectId: string }
  | { kind: "authenticated-tool"; userId: string; toolSlug: PremiumImageTool };

export interface AccessIdentity {
  sessionId: string;
  userId: string | null;
}

export interface CompressorUsageStatus {
  mode: "anonymous" | "authenticated";
  used: number;
  limit: number;
  remaining: number;
  allowed: boolean;
}

export interface AccessStatus {
  authenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  compressor: CompressorUsageStatus;
  /** Per-tool gate for resizer/cropper/converter under the free-launch model. */
  tools: Record<PremiumImageTool, ToolGateState>;
  /** @deprecated kept for API compatibility; always free at launch. */
  trials: Record<PremiumImageTool, "auth-required" | "available" | "used" | "premium">;
  entitlement: EntitlementSummary;
}
