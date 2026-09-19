import NextAuth from "next-auth";
import { ensureAuthEnv } from "@/lib/auth/ensure-auth-env";
import { authConfig } from "@/lib/auth/config";

ensureAuthEnv();

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
