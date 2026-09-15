"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAccessStatus, type ClientAccessStatus } from "@/lib/client/access";

export function useAccessStatus() {
  const [status, setStatus] = useState<ClientAccessStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchAccessStatus();
      setStatus(next);
    } catch {
      // Server-side checks still enforce limits if status cannot be loaded.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetchAccessStatus()
      .then((next) => {
        if (!cancelled) {
          setStatus(next);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, refresh };
}
