"use client";

export function ProcessingState({
  message,
  progress = 0,
  detail,
}: {
  message: string;
  progress?: number;
  detail?: string;
}) {
  const completed = Math.max(0, Math.min(100, Math.round(progress)));
  const pending = 100 - completed;

  return (
    <div className="rounded-md bg-muted/40 px-4 py-4" role="status" aria-live="polite" aria-busy="true">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 size-5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium">{message}</p>
            <p className="text-sm font-medium tabular-nums text-muted-foreground">
              <span className="sr-only">Progress: </span>
              {pending}% remaining
            </p>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Compression progress"
          >
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
              style={{ width: `${completed}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{detail ?? "This usually takes a few seconds."}</p>
        </div>
      </div>
    </div>
  );
}
