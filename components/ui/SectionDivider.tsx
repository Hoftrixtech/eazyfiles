/** Optional explicit divider; prefer `main > section + section` in globals.css. */
export function SectionDivider() {
  return <div className="border-t border-[var(--section-divider)]" aria-hidden="true" />;
}
