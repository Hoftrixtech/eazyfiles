/** Shared classes for primary CTAs (gradient + 10px radius). */
export const brandCtaClass =
  "inline-flex items-center justify-center gap-2 btn-radius brand-gradient-bg border-0 px-4 text-sm font-medium text-primary-foreground shadow-sm transition-[filter,transform] hover:brightness-[1.06] active:scale-[0.98] active:brightness-[0.98]";

export const brandCtaSelectedClass = "btn-radius brand-gradient-bg text-primary-foreground shadow-sm";

/** Secondary header CTA (outline) — pairs with brandCtaClass. */
export const brandOutlineCtaClass =
  "inline-flex items-center justify-center gap-2 btn-radius border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted";
