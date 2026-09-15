import "server-only";

import { AppError } from "@/lib/errors";
import { LAUNCH_ACCESS } from "@/lib/plans/config";
import {
  getAnonymousCompressorCount,
  releaseAnonymousCompressor,
  reserveAnonymousCompressor,
} from "@/lib/access/anonymous-compress";
import { authenticatedUsageSubject, isPremiumImageTool } from "@/lib/access/tools";
import { releaseUsageSlot, reserveUsageSlot } from "@/lib/usage";
import type { AccessIdentity, AccessReservation, ProcessingTool } from "@/types/access";

export async function reserveToolAccess(
  tool: ProcessingTool,
  identity: AccessIdentity
): Promise<AccessReservation> {
  if (tool === "compress") {
    if (!identity.userId) {
      const reserved = await reserveAnonymousCompressor(identity.sessionId);
      if (!reserved) {
        throw new AppError(
          "ANONYMOUS_LIMIT_REACHED",
          "You've used your 5 free compressions. Log in or create a free account to continue.",
          403
        );
      }
      return { kind: "anonymous-compress", sessionId: identity.sessionId };
    }

    const subjectId = authenticatedUsageSubject(identity.userId);
    const reserved = await reserveUsageSlot(
      subjectId,
      LAUNCH_ACCESS.authenticatedCompressorDailyLimit
    );
    if (!reserved) {
      throw new AppError("RATE_LIMITED", "Daily compression limit reached. Please try again tomorrow.", 429);
    }
    return { kind: "authenticated-compress", subjectId };
  }

  if (!isPremiumImageTool(tool)) {
    throw new AppError("INVALID_REQUEST", "This tool is not available.", 400);
  }

  if (!identity.userId) {
    throw new AppError("AUTH_REQUIRED", "Log in to use this free tool.", 401);
  }

  // Logged-in users get all current image tools free (no trial / premium gate).
  return { kind: "authenticated-tool", userId: identity.userId, toolSlug: tool };
}

export async function releaseToolAccess(reservation: AccessReservation | null | undefined): Promise<void> {
  if (!reservation) {
    return;
  }

  if (reservation.kind === "anonymous-compress") {
    await releaseAnonymousCompressor(reservation.sessionId);
    return;
  }

  if (reservation.kind === "authenticated-compress") {
    await releaseUsageSlot(reservation.subjectId);
    return;
  }

  // authenticated-tool reservations are not consumed and need no release.
}

export async function remainingAnonymousCompressions(sessionId: string): Promise<number> {
  const used = await getAnonymousCompressorCount(sessionId);
  return Math.max(0, LAUNCH_ACCESS.anonymousCompressorLimit - used);
}
