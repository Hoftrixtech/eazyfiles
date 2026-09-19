import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import type { AuthProviderId } from "@/models/User";
import { User } from "@/models/User";

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  providers: AuthProviderId[];
  memberSince: Date | null;
};

export async function getAccountProfile(userId: string): Promise<AccountProfile | null> {
  await connectToDatabase();
  const doc = await User.findById(userId).select("name email providers createdAt").lean();
  if (!doc) {
    return null;
  }

  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    providers: (doc.providers ?? []) as AuthProviderId[],
    memberSince: doc.createdAt ?? null,
  };
}
