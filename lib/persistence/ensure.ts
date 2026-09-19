import "server-only";

import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";

export type PersistenceMode = "mongo" | "memory";

let activeMode: PersistenceMode | null = null;

export function allowMemoryPersistenceFallback(): boolean {
  if (process.env.PERSISTENCE_MODE === "memory") {
    return true;
  }
  if (process.env.ALLOW_LOCAL_MEMORY_FALLBACK === "true") {
    return true;
  }
  return process.env.NODE_ENV === "development";
}

export function isMemoryPersistence(): boolean {
  return activeMode === "memory" || process.env.PERSISTENCE_MODE === "memory";
}

export async function ensurePersistence(): Promise<PersistenceMode> {
  if (process.env.PERSISTENCE_MODE === "memory") {
    activeMode = "memory";
    return "memory";
  }

  if (activeMode === "memory") {
    return "memory";
  }

  if (activeMode === "mongo") {
    await connectToDatabase();
    return "mongo";
  }

  // Avoid blocking image tools on slow/unreachable Atlas when local fallback is enabled.
  if (process.env.ALLOW_LOCAL_MEMORY_FALLBACK === "true") {
    activeMode = "memory";
    return "memory";
  }

  if (!isMongoConfigured()) {
    if (allowMemoryPersistenceFallback()) {
      activeMode = "memory";
      return "memory";
    }
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await connectToDatabase();
    activeMode = "mongo";
    return "mongo";
  } catch (error) {
    if (allowMemoryPersistenceFallback()) {
      activeMode = "memory";
      return "memory";
    }
    throw error;
  }
}

/** Reset mode between tests. */
export function resetPersistenceModeForTests(): void {
  activeMode = null;
}
