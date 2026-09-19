import "server-only";

import { randomBytes } from "node:crypto";

const anonymousCounts = new Map<string, number>();
const usageCounts = new Map<string, number>();

function usageKey(sessionId: string, date: string): string {
  return `${sessionId}:${date}`;
}

export function memoryGetAnonymousCompressorCount(sessionId: string): number {
  return anonymousCounts.get(sessionId) ?? 0;
}

export function memoryReserveAnonymousCompressor(sessionId: string, limit: number): boolean {
  const used = memoryGetAnonymousCompressorCount(sessionId);
  if (used >= limit) {
    return false;
  }
  anonymousCounts.set(sessionId, used + 1);
  return true;
}

export function memoryReleaseAnonymousCompressor(sessionId: string): void {
  const used = memoryGetAnonymousCompressorCount(sessionId);
  if (used > 0) {
    anonymousCounts.set(sessionId, used - 1);
  }
}

export function memoryGetTodayCompressionCount(sessionId: string, date: string): number {
  return usageCounts.get(usageKey(sessionId, date)) ?? 0;
}

export function memoryGetTotalCompressionCount(sessionId: string): number {
  const prefix = `${sessionId}:`;
  let total = 0;
  for (const [key, count] of usageCounts.entries()) {
    if (key.startsWith(prefix)) {
      total += count;
    }
  }
  return total;
}

export function memoryReserveUsageSlot(sessionId: string, date: string, limit: number): boolean {
  const key = usageKey(sessionId, date);
  const used = usageCounts.get(key) ?? 0;
  if (used >= limit) {
    return false;
  }
  usageCounts.set(key, used + 1);
  return true;
}

export function memoryReleaseUsageSlot(sessionId: string, date: string): void {
  const key = usageKey(sessionId, date);
  const used = usageCounts.get(key) ?? 0;
  if (used > 0) {
    usageCounts.set(key, used - 1);
  }
}

export function memoryCreateJobId(): string {
  return `mem_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}
