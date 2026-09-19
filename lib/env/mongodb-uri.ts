import "server-only";

/** Hostinger / Atlas may expose the URI under different variable names. */
export function getMongoDbUri(): string | undefined {
  const candidates = [
    process.env.MONGODB_URI,
    process.env.DATABASE_URL,
    process.env.MONGO_URL,
  ];

  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
}

export function isMongoDbUriConfigured(): boolean {
  return Boolean(getMongoDbUri());
}
