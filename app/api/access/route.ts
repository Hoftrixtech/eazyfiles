import "server-only";

import { NextResponse } from "next/server";
import { getAccessStatus, getSessionScopedAccessStatus, resolveAccessIdentity } from "@/lib/access";
import { applySessionHeaders } from "@/lib/session";
import { ensurePersistence } from "@/lib/persistence/ensure";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonStatus(status: Awaited<ReturnType<typeof getAccessStatus>>, sessionId: string): Response {
  const payload = {
    authenticated: status.authenticated,
    user: status.user ? { name: status.user.name, email: status.user.email } : null,
    compressor: status.compressor,
    tools: status.tools,
  };

  const response = NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
  applySessionHeaders(response.headers, sessionId);
  return response;
}

export async function GET(request: Request): Promise<Response> {
  const identity = await resolveAccessIdentity(request);

  try {
    await ensurePersistence();
    return jsonStatus(await getAccessStatus(identity), identity.sessionId);
  } catch {
    return jsonStatus(await getSessionScopedAccessStatus(identity), identity.sessionId);
  }
}
