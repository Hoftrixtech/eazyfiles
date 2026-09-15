"use client";

import { AlertCircle } from "lucide-react";

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      className="flex gap-3 rounded-md border border-destructive/20 bg-destructive-soft px-4 py-3 text-destructive"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
