import { SESSION_HEADER_NAME } from "@/lib/constants";
import { getAnonymousSessionId, persistAnonymousSessionId } from "@/lib/client/session";
import type { CompressorUsageStatus, PremiumImageTool, ToolGateState } from "@/types/access";

export type ClientAccessStatus = {
  authenticated: boolean;
  user: { name: string; email: string } | null;
  compressor: CompressorUsageStatus;
  tools: Record<PremiumImageTool, ToolGateState>;
};

export type { CompressorUsageStatus, PremiumImageTool, ToolGateState };

export async function fetchAccessStatus(): Promise<ClientAccessStatus> {
  const sessionId = getAnonymousSessionId();
  const response = await fetch("/api/access", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: sessionId ? { [SESSION_HEADER_NAME]: sessionId } : undefined,
  });

  const returnedSession = response.headers.get("X-Session-Id");
  if (returnedSession) {
    persistAnonymousSessionId(returnedSession);
  }

  if (!response.ok) {
    throw new Error("Could not load account access status.");
  }

  return (await response.json()) as ClientAccessStatus;
}
