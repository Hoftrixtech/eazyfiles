/** Shared classes for primary CTAs (gradient + 10px radius). */
export const brandCtaClass =
  "inline-flex items-center justify-center gap-2 btn-radius brand-gradient-bg border-0 px-4 text-sm font-medium text-primary-foreground shadow-sm cursor-pointer";

export const brandCtaSelectedClass = "btn-radius brand-gradient-bg text-primary-foreground shadow-sm cursor-pointer";

/** Secondary header CTA (outline) — pairs with brandCtaClass. */
export const brandOutlineCtaClass =
  "inline-flex items-center justify-center gap-2 btn-radius border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted cursor-pointer";
