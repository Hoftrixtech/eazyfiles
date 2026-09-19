import "server-only";

import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  indexesEnsured: boolean;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
  indexesEnsured: false,
};

globalForMongoose.mongooseCache = cache;

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

async function ensureIndexes(): Promise<void> {
  if (cache.indexesEnsured) {
    return;
  }

  try {
    const { CompressionJob } = await import("@/models/CompressionJob");
    const { Usage } = await import("@/models/Usage");
    const { User } = await import("@/models/User");
    const { AnonymousUsage } = await import("@/models/AnonymousUsage");
    const { UserTrial } = await import("@/models/UserTrial");
    const { LoginAttempt } = await import("@/models/LoginAttempt");
    const { Entitlement } = await import("@/models/Entitlement");
    const { OAuthAccount } = await import("@/models/OAuthAccount");
    const { Contact } = await import("@/models/Contact");
    const { ContactRateLimit } = await import("@/models/ContactRateLimit");
    await Promise.all([
      CompressionJob.createIndexes(),
      Usage.createIndexes(),
      User.createIndexes(),
      AnonymousUsage.createIndexes(),
      UserTrial.createIndexes(),
      LoginAttempt.createIndexes(),
      Entitlement.createIndexes(),
      OAuthAccount.createIndexes(),
      Contact.createIndexes(),
      ContactRateLimit.createIndexes(),
    ]);
    cache.indexesEnsured = true;
  } catch {
    cache.indexesEnsured = false;
  }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn && cache.conn.connection.readyState === 1) {
    return cache.conn;
  }

  if (cache.conn && cache.conn.connection.readyState !== 1) {
    cache.conn = null;
    cache.promise = null;
    cache.indexesEnsured = false;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
      socketTimeoutMS: 15_000,
    });
  }

  try {
    cache.conn = await cache.promise;
    await ensureIndexes();
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    cache.conn = null;
    throw error;
  }
}
