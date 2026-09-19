"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth-actions";

export function LogoutMenuItem() {
  return (
    <form action={logoutAction} className="w-full">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
      >
        <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
        Log out
      </button>
    </form>
  );
}
