import "server-only";

import { auth } from "@/auth";
import { resolveSessionId } from "@/lib/session";
import type { AccessIdentity } from "@/types/access";

export async function resolveAccessIdentity(request: Request): Promise<AccessIdentity> {
  const sessionId = resolveSessionId(request);
  const session = await auth();
  const userId = session?.user?.id ?? null;
  return { sessionId, userId };
}

export async function getSessionUser(): Promise<{ id: string; name: string; email: string } | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email,
  };
}
